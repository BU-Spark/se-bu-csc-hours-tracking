"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Layout, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import { useSession } from "next-auth/react";
import {
  getEventsByOrganizerId,
  getOrganizationByUserId,
} from "./action";
import CardGrid from "./CardGrid";

function EventsBar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user.id) {
      return; // Early exit if session is not yet loaded
    }

    const fetchEvents = async () => {
      console.log("Fetching events");
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
  }, [session]);

  // Prepare the filter to pass to CardGrid
  const filterDate = new Date(); // Today's date
  filterDate.setHours(0, 0, 0, 0); // Normalize to start of the day

  return (
    <Layout
      style={{
        backgroundColor: "white",
        display: "flex",
        width: "60vw",
      }}
    >
      <h1>Upcoming Events</h1>
      <Content style={{ width: "100%" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
            }}
          >
            <Spin />
          </div>
        ) : events ? (
          <CardGrid
            events={events}
            filter={filterDate} // Pass today's date to filter upcoming events
            myEvents={undefined} // Not using 'myEvents' here
            view={"default"} // Set view to 'default'
            pastEvents={false} // Exclude past events
          />
        ) : (
          <p>Loading...</p>
        )}
      </Content>
    </Layout>
  );
}

export default EventsBar;