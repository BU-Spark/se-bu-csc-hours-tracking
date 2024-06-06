"use client";
import React, { useState, useEffect } from "react";
import EventCard from "@/components/EventCard/EventCard";
import { Event } from "@/interfaces/interfaces";
import { getEvents } from "./action";

function Events() {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents();
      setEvents(eventResult);
    };
    fetchEvents();
    console.log(events);
  }, []);

  return (
    <div>
      {events ? (
        <button
          onClick={() => {
            console.log(events);
          }}
        >
          click
        </button>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}

export default Events;
