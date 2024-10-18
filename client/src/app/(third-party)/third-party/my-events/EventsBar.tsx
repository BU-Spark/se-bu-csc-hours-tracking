"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Button, Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSession } from "next-auth/react";
import {
  getEvents,
  getEventsByOrganizerId,
  getOrganizationByUserId,
} from "./action";
import CardGrid from "./CardGrid";
import {
  AddHoursButton,
  PlusCircle,
  Rectangle,
  SummaryBox,
  SummaryContainer,
} from "@/_common/styledDivs";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation";
import DateFilter from "./DateFilter";

function EventsBar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());



  useEffect(() => {
    if (!session?.user.id) {
      return; // Early exit if session is not yet loaded
    }

    const fetchEvents = async () => {
      console.log("fetchefvents")
      const userId = session?.user.id;
      if (userId) {
        const org = await getOrganizationByUserId(Number(userId));
        const orgId = org?.affiliation?.id || 0;
        const eventResult = await getEventsByOrganizerId(orgId);
        setEvents(eventResult);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchEvents();
  }, [dateFilter]);

  const handleSetDateFilter = (date: Date) => {
    setDateFilter(date);
  };

  const today = new Date();
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const eventsToday = events.filter((event) =>
    isToday(new Date(event.event_start))
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_start) > today
  );

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
        <div style={{ margin: "2rem 0", display: "flex", alignItems: "center" }}>
        <DateFilter setDateFilter={handleSetDateFilter} />
          <AddHoursButton
            onClick={() => router.push("/third-party/my-events/new")}
            style={{ marginRight: "1rem" }} // Optional: Add some margin to the button
          >
            <PlusCircle>
              <AiOutlinePlus />
            </PlusCircle>
            <Rectangle>Create Event</Rectangle>
          </AddHoursButton>
        </div>
        {loading ? (
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
        ) : events ? (
          <CardGrid
            events={events}
            filter={dateFilter}
            myEvents={undefined}
            view={"admin"}
            pastEvents={true}
          />
        ) : (
          <p>loading</p>
        )}
      </Content>
    </Layout>
  );
}

export default EventsBar;
