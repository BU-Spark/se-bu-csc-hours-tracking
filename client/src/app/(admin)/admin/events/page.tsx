"use client";
import React, { useState, useEffect } from "react";
import { EventInput } from "@/interfaces/interfaces";
import { Event } from "@prisma/client";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import StyledButton from "@/components/StyledButton";
import { useSession } from "next-auth/react";
import {
  createDummyEvent,
  getApplicationsByUserId,
  getEvents,
  getEventsByApplicationEventIds,
} from "@/app/(user)/user/events/action";
import CardGrid from "@/app/(user)/user/events/CardGrid";
import {
  AddHoursButton,
  AddHoursButtonContainer,
  PlusCircle,
  Rectangle,
} from "@/_common/styledDivs";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<number>(0);
  const { data: session, status } = useSession();
  const router = useRouter();

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
          <AddHoursButtonContainer>
          <AddHoursButton onClick={() => router.push("/admin/events/new")}>
            <PlusCircle>
              <AiOutlinePlus />
            </PlusCircle>
            <Rectangle>Create Event</Rectangle>
          </AddHoursButton>
        </AddHoursButtonContainer>
        {events ? (
          <CardGrid events={events} filter={filter} myEvents={myEvents} />
        ) : (
          <p>loading</p>
        )}
      </Content>
    </Layout>
  );
}

export default Events;
