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
import { Checkbox, Layout, Spin } from "antd";
import CardGrid from "@/components/CardGrid/CardGrid";
import { Content } from "antd/es/layout/layout";
import StyledButton from "@/components/StyledButton";
import { useSession } from '@clerk/clerk-react'
import { getPersonFromUser } from "@/lib/getPersonFromUser";

function Events() {
  const [events, setEvents] = useState<Event[]>();
  const [myEvents, setMyEvents] = useState<Event[]>();
  const [filter, setFilter] = useState<number>(0);
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);
  const { session } = useSession();

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

      const { userId } = await getPersonFromUser(session?.user.id);

      const userApplications = await getApplicationsByUserId(
        userId
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Checkbox onChange={() => setShowPastEvents(!showPastEvents)}>
            Show past events
          </Checkbox>
        </div>
        {(filter == 0 && events) || (filter == 1 && myEvents) ? (
          <CardGrid
            events={events}
            filter={filter}
            myEvents={myEvents}
            view="student"
            pastEvents={showPastEvents}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              top: 0,
              bottom: 0,
            }}
          >
            <Spin />
          </div>
        )}
        {/* UNCOMMENT TO MAKE DUMMY DATA */}
        {/* <button
          onClick={() => {
            createDummyEvent(dummyEvent);
          }}
          style={{ position: "fixed", bottom: 0 }}
        >
          Make new Event
        </button> */}
      </Content>
    </Layout>
  );
}

export default Events;
