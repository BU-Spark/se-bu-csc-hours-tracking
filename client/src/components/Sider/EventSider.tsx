"use client";
import React, { useEffect, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";
import "./CustomSider.css";
import { formatDate } from "@/app/_utils/DateFormatters";
import { Application } from "@prisma/client";
import { GroupedEvents } from "@/interfaces/interfaces";
import {
  getApplicationsByUserId,
  getEventsByApplicationEventIds,
} from "@/app/(user)/user/events/action";
import { Event } from "@prisma/client";
import { buRed } from "@/_common/styles";
import { useSession } from "next-auth/react";

function EventSider() {
  //session and path vars
  const path = usePathname();
  const { data: session, status } = useSession();
  const isDisplayed = path === "/user/events";

  //useState variables
  const [myApplications, setMyApplications] = useState<Application[]>();
  const [eventGroups, setEventGroups] = useState<GroupedEvents>();

  const [loading, setLoading] = useState(true);

  //GET EVENTS USER IS SIGNED UP FOR THAT ARE UPCOMING
  useEffect(() => {
    if (!isDisplayed) return;
    setLoading(true);
    const fetchMyApplications = async () => {
      if (!session?.user?.id) return;

      const userApplications = await getApplicationsByUserId(
        Number(session.user.id)
      ); //get all user applications
      if (userApplications) {
        setMyApplications(userApplications);
        const eventIds = userApplications.map(
          (application) => application.event_id
        );
        const userEvents = await getEventsByApplicationEventIds(eventIds); //get all events those applications were related to that are upcoming
        if (userEvents) {
          groupEventsByDate(userEvents);
        }
      }
    };
    fetchMyApplications();
  }, [session, isDisplayed]);

  // **Uncomment if you want category names
  // const translateToCategoryNames = async (events: Event[]) => {
  //   const categoryIds = Array.from(
  //     new Set(events.map((event) => event.category_id))
  //   );
  //   const categoryFetchPromises = categoryIds.map((id) => getCategoryById(id));
  //   const categoryResults = await Promise.all(categoryFetchPromises);

  //   const newCategoryNames: { [key: number]: string } = {};
  //   categoryResults.forEach((result) => {
  //     if (result) {
  //       newCategoryNames[result.id] = result.name;
  //     }
  //   });

  //   return newCategoryNames;
  // };

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
    setLoading(false);
  }

  const DateGroup = ({ events, date }: { events: Event[]; date: string }) => {
    const formattedDate = formatDate(new Date(date), false);

    return (
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          flexDirection: "column",
        }}
        className="wrapper"
      >
        <p style={{ marginBottom: "1rem", fontWeight: 400 }}>{formattedDate}</p>
        <div style={{ margin: 0 }} className="events">
          {events.map((event: Event, eventIndex: number) => {
            const application = myApplications?.find(
              (app) => app.event_id === event.id
            );
            const approved = application
              ? application.approval_status == 1
              : false;

            return (
              <div
                key={eventIndex}
                style={{
                  borderLeft: `4px ${buRed} solid`,
                  padding: "0rem 0.5rem",
                  marginBottom: "1.5rem",
                  marginTop: 0,
                  borderRadius: "2px",
                  height: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  fontWeight: 100,
                  fontSize: "small",
                  flexDirection: "column",
                }}
                className="event"
              >
                <p
                  style={{
                    margin: 0,
                    right: 0,
                    left: 0,

                    fontWeight: 500,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {event.title}
                  {/* {categoryNames[event.category_id]} */}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.6rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {approved ? "Approved" : "Pending"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return isDisplayed ? (
    <Sider
      width="20%"
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
        paddingLeft: "1rem",
      }}
    >
      <div
        className="sider-content"
        style={{
          marginLeft: 0,
          marginRight: 0,
          marginTop: "5rem",
          fontWeight: "900",
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
        }}
      >
        <p style={{ marginBottom: "0rem", fontSize: "large" }}>
          Upcoming Events
        </p>
        {loading ? (
          <p style={{ fontWeight: 200, fontSize: "small" }}>
            Loading Your Events...
          </p>
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
