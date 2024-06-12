"use client";
import React, { useEffect, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { usePathname } from "next/navigation";
import "./CustomSider.css";
import { formatDate } from "@/app/events/[event_id]/page";
import { GroupedEvents } from "@/interfaces/interfaces";
import { getEvents } from "@/app/events/action";
import { Event } from "@/interfaces/interfaces";
import { group } from "console";

function EventSider() {
  const path = usePathname();
  const isDisplayed = path === "/events";
  const [events, setEvents] = useState<Event[]>();
  const [eventGroups, setEventGroups] = useState<GroupedEvents>();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents(); //replace this with 'getEventsByUser()'
      setEvents(eventResult);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events) groupEventsByDate(events);
    console.log(events);
    console.log(eventGroups);
  }, [events]);

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
        <ul>
          {events.map((event: Event, eventIndex: number) => (
            <li key={eventIndex}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
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
        {eventGroups ? (
          Object.entries(eventGroups).map(([date, events], index) => (
            <div key={index}>
              <DateGroup events={events} date={date} />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </Sider>
  ) : (
    ""
  );
}

export default EventSider;
