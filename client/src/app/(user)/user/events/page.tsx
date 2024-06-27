"use client";
import React, { useState, useEffect } from "react";
import { EventInput } from "@/interfaces/interfaces";
import { Event } from "@prisma/client";
import {
  createDummyEvent,
  getApplicationsByUserId,
  getEvents,
  getEventsByApplicationEventIds,
} from "./action";
import { Layout } from "antd";
import CardGrid from "./CardGrid";
import { Content } from "antd/es/layout/layout";
import StyledButton from "@/components/StyledButton";
import { useSession } from "next-auth/react";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<number>(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents();
      setEvents(eventResult);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!session?.user.id) return;

      const userApplications = await getApplicationsByUserId(
        Number(session.user.id)
      ); //get all user applications
      if (userApplications) {
        const eventIds = userApplications.map(
          (application) => application.event_id
        );
        const userEvents = await getEventsByApplicationEventIds(eventIds); //get all events those applications were related to
        if (userEvents) {
          setMyEvents(userEvents);
        }
      }
    };
    fetchMyApplications();
  }, [filter]);

  const dummyEvent: EventInput = {
    title: "Dummy " + new Date().toTimeString(),
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
      <Content style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "28%",
            margin: "1rem auto",
          }}
        >
          <StyledButton
            text="My Events"
            onClick={() => setFilter(1)}
            selected={filter == 1}
          />
          <StyledButton
            text="All Events"
            onClick={() => setFilter(0)}
            selected={filter == 0}
          />
        </div>
        {events ? (
          <CardGrid
            events={events}
            filter={filter}
            myEvents={myEvents}
            view="student"
          />
        ) : (
          <p>loading</p>
        )}
        {/* UNCOMMENT TO MAKE DUMMY DATA */}
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
