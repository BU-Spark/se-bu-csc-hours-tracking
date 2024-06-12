"use client";
import React, { useEffect, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";
import "./CustomSider.css";
import { formatDate } from "@/app/events/[event_id]/page";
import { Application, Person } from "@prisma/client";
import { GroupedEvents } from "@/interfaces/interfaces";
import {
  getApplicationsByUserId,
  getEvents,
  getEventsByApplicationEventIds,
  getUserByEmail,
} from "@/app/events/action";
import { Event } from "@/interfaces/interfaces";
import { buRed } from "@/common/styles";
import { getCategoryById } from "../EventCard/action";
import { useSession } from "next-auth/react";

function EventSider() {
  //session and path vars
  const path = usePathname();
  const { data: session, status } = useSession();
  const isDisplayed = path === "/events";

  //useState variables
  const [user, setUser] = useState<Person>();
  const [events, setEvents] = useState<Event[]>();
  const [myEvents, setMyEvents] = useState<Event[]>();
  const [myApplications, setMyApplications] = useState<Application[]>();
  const [eventGroups, setEventGroups] = useState<GroupedEvents>();
  const [categoryNames, setCategoryNames] = useState<{ [key: number]: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  //GET ALL EVENTS AND CATEGORY NAMES
  useEffect(() => {
    if (!isDisplayed) return;
    const fetchEventsAndCategories = async () => {
      setLoading(true);

      //get events
      const eventResult = await getEvents();
      setEvents(eventResult);

      //get categories
      const newCategoryNames = await translateToCategoryNames(eventResult);
      setCategoryNames(newCategoryNames);

      setLoading(false);
    };

    fetchEventsAndCategories();
  }, []);

  //GROUP EVENTS BY DATE
  useEffect(() => {
    if (!isDisplayed) return;
    if (myEvents) {
      groupEventsByDate(myEvents);
    }
  }, [myEvents]);

  // GET USER INFO
  useEffect(() => {
    if (!isDisplayed) return;
    const fetchUser = async () => {
      if (!session?.user.email) {
        return;
      }
      try {
        const user = await getUserByEmail(session.user.email);
        if (!user) {
          console.error("User not found in database");
          return;
        }
        setUser(user);
        console.log("user", user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [session]);

  //Get events user if trying to go to
  useEffect(() => {
    if (!isDisplayed) return;
    const fetchMyApplications = async () => {
      if (!user?.id) return;

      const userApplications = await getApplicationsByUserId(user.id);
      if (userApplications) {
        setMyApplications(userApplications);
        const eventIds = userApplications.map(
          (application) => application.event_id
        );
        const userEvents = await getEventsByApplicationEventIds(eventIds);
        if (userEvents) {
          setMyEvents(userEvents);
        }
        console.log("userEvents:", userEvents);
      }
      console.log("userApplications:", userApplications);

      //
    };
    fetchMyApplications();
  }, [user]);

  const translateToCategoryNames = async (events: Event[]) => {
    const categoryIds = Array.from(
      new Set(events.map((event) => event.category_id))
    );
    const categoryFetchPromises = categoryIds.map((id) => getCategoryById(id));
    const categoryResults = await Promise.all(categoryFetchPromises);

    const newCategoryNames: { [key: number]: string } = {};
    categoryResults.forEach((result) => {
      if (result) {
        newCategoryNames[result.id] = result.name;
      }
    });

    return newCategoryNames;
  };

  function groupEventsByDate(events: Event[]): void {
    const groupedEvents: GroupedEvents = {};
    events.forEach((event) => {
      const eventDate = event.event_start.toISOString().split("T")[0];

      if (groupedEvents[eventDate]) {
        groupedEvents[eventDate].push(event);
      } else {
        groupedEvents[eventDate] = [event];
      }
    });

    setEventGroups(groupedEvents);
  }

  const DateGroup = ({ events, date }: { events: Event[]; date: string }) => {
    const formattedDate = formatDate(new Date(date), false);

    return (
      <div>
        <h3>{formattedDate}</h3>
        <div>
          {events.map((event: Event, eventIndex: number) => (
            <div
              key={eventIndex}
              style={{
                borderLeft: `4px ${buRed} solid`,
                padding: "0rem 0.5rem",
                margin: "1.5rem 0rem",
                borderRadius: "2px",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                fontWeight: 100,
                fontSize: "small",
                flexDirection: "column",
              }}
            >
              <p style={{ margin: 0, fontWeight: 500 }}>
                {categoryNames[event.category_id]}
              </p>
              <p style={{ margin: 0, fontSize: "0.6rem" }}>
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return isDisplayed ? (
    <Sider
      width="18%"
      style={{
        background: "white",
        marginTop: "0em",
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        zIndex: 2,
        right: 0,
        top: 0,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        className="sider-content"
        style={{ marginTop: "6rem", fontWeight: "900" }}
      >
        Upcoming Events
        {loading ? (
          <p>...</p>
        ) : (
          eventGroups &&
          Object.entries(eventGroups).map(([date, events], index) => (
            <div key={index}>
              <DateGroup events={events} date={date} />
            </div>
          ))
        )}
      </div>
    </Sider>
  ) : (
    ""
  );
}

export default EventSider;
