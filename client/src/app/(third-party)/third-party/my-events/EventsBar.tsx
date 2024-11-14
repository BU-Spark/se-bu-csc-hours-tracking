"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Button, Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSession } from '@clerk/clerk-react';
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
  const { session } = useSession();
  const [sessionLoaded, setSessionLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState<Date>(new Date());


  //not sure why session gets updated on switching tabs, but im not gonna mess w it
  useEffect(() => {
    if(!sessionLoaded && session?.user.id){
      setSessionLoaded(true);
    }
  }, [session])

  useEffect(() => {
    const fetchEvents = async () => {
      const userId = session?.user.id;
      if (userId) {
        setLoading(true);
        const org = await getOrganizationByUserId(Number(userId));
        const orgId = org?.affiliation?.id || 0;
        const eventResult = await getEventsByOrganizerId(orgId);
        setEvents(eventResult);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [sessionLoaded]);

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
        minHeight:"300px"
      }}
    >
      <Content style={{ width: "100%" }}>
        {/* Non-scrollable header section */}
        <div style={{ margin: "0rem 0", display: "flex", alignItems: "center" }}>
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
  
        {/* Scrollable content */}
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight:"200px"
            }}
          >
            <Spin />
          </div>
        ) : events ? (
          <div
            style={{
              overflowX: "auto",     // Enables horizontal scrolling
              maxHeight: "80vh",      // Adjust height as needed to fit your layout
            }}
          >
            <CardGrid
              events={events}
              filter={dateFilter}
              myEvents={undefined}
              view={"admin"}
              pastEvents={true}
            />
          </div>
        ) : (
          <p>loading</p>
        )}
      </Content>
    </Layout>
  );  
}

export default EventsBar;
