"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Button, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSession } from "next-auth/react";
import {
  getApplicationsByUserId,
  getEvents,
  getEventsByApplicationEventIds,
} from "@/app/(user)/user/events/action";
import CardGrid from "@/app/(user)/user/events/CardGrid";
import { AddHoursButton, PlusCircle, Rectangle } from "@/_common/styledDivs";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import DateFilter from "./DataFilter";

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventResult = await getEvents();
      setEvents(eventResult);
      setLoading(false);
    };
    setLoading(true);
    fetchEvents();
  }, [dateFilter]); // Fetch events whenever dateFilter changes

  const handleSetDateFilter = (date: Date) => {
    setDateFilter(date);
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
        <div style={{ margin: "2rem 0" }}>
          <AddHoursButton onClick={() => router.push("/admin/events/new")}>
            <PlusCircle>
              <AiOutlinePlus />
            </PlusCircle>
            <Rectangle>Create Event</Rectangle>
          </AddHoursButton>
        </div>
        <DateFilter setDateFilter={handleSetDateFilter} />
        {loading ? (
          <>Loading events...</>
        ) : events ? (
          <CardGrid events={events} filter={dateFilter} myEvents={myEvents} />
        ) : (
          <p>loading</p>
        )}
      </Content>
    </Layout>
  );
}

export default Events;
