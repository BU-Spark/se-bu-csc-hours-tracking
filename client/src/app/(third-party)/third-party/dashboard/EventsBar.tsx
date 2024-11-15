// dashboard/EventsBar.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Event } from "@prisma/client";
import { Layout, Spin } from "antd";
import { useSession } from '@clerk/clerk-react'
import {
  getEventsByOrganizerId,
  getOrganizationByUserId,
} from "./action";
import CardGrid from "./CardGrid";

function EventsBar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { session } = useSession();

  useEffect(() => {
    if (!session?.user.id) {
      return; // Early exit if session is not yet loaded
    }

    const fetchEvents = async () => {
      console.log("Fetching events");

      const userId = session.user.id;
      const org = await getOrganizationByUserId(userId);
      const orgId = org?.id
      if (!orgId) {
        setLoading(false);
        throw new Error("Organization not found");
      }
      const eventResult = await getEventsByOrganizerId(orgId);
      setEvents(eventResult);
      setLoading(false);
      
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
        borderRadius: "8px", // Optional: add border radius for aesthetics
      }}
    >
      <h1
        style={{
          marginTop: "0",
        }}
      >Upcoming Events</h1>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10rem", // Ensure spinner is centered vertically
          }}
        >
          <Spin />
        </div>
      ) : (
        <CardGrid
          events={events}
          filter={filterDate} // Pass today's date to filter upcoming events
          myEvents={undefined} // Not using 'myEvents' here
          view={"default"} // Set view to 'default'
          pastEvents={false} // Exclude past events
        />
      )}
    </Layout>
  );
}

export default EventsBar;