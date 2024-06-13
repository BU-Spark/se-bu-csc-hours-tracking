"use client";
import React, { useState, useEffect } from "react";
import { Event, EventInput } from "@/interfaces/interfaces";
import { createDummyEvent, getEvents } from "./action";
import { Layout } from "antd";
import CardGrid from "./CardGrid";
import { Content } from "antd/es/layout/layout";

function Events() {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents();
      setEvents(eventResult);
    };
    fetchEvents();
  }, []);

  const dummyEvent: EventInput = {
    title: "Dummy",
    event_start: new Date(),
    event_end: new Date(),
    reg_start: new Date(),
    reg_end: new Date(),
    estimated_participants: 100,
    location: "Nowhere",
    transit: "Walk",
    description: "This is a fake Event",
    form_id: null,
    image:
      "/Users/owenmariani/Desktop/se-bu-csc-hours-tracking/client/public/photos/beach-cleanup.png",
  };

  return (
    <Layout
      style={{
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "60vw",
      }}
    >
      <Content>
        {events ? <CardGrid events={events} /> : <p>loading</p>}
        <button
          onClick={() => {
            createDummyEvent(dummyEvent);
          }}
          style={{ position: "fixed", bottom: 0 }}
        >
          Make new Event
        </button>
      </Content>
    </Layout>
  );
}

export default Events;
