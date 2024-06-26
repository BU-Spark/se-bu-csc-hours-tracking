"use client";

import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useRouter } from "next/navigation";
import { getEvents } from "./[events_id]/action";
import { Event } from "../../../../interfaces/interfaces";
import EventCard from "../../../../components/EventCard/EventCard";
import { AiOutlinePlus } from "react-icons/ai";
import {
  AddHoursButtonContainer,
  AddHoursButton,
  PlusCircle,
  Rectangle,
} from "../../../../_common/styledDivs";
import { Buffer } from "buffer";

const { Content } = Layout;

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        const transformedEvents = fetchedEvents.map((event) => ({
          ...event,
          image: Buffer.from(event.image, "base64"),
        }));
        setEvents(transformedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <Content style={{ padding: "2rem" }}>
        <AddHoursButtonContainer>
          <AddHoursButton onClick={() => router.push("/admin/events/new")}>
            <PlusCircle>
              <AiOutlinePlus />
            </PlusCircle>
            <Rectangle>Create Event</Rectangle>
          </AddHoursButton>
        </AddHoursButtonContainer>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event_id={event.id}
              title={event.title}
              category_id={event.category_id}
              coordinator_id={event.coordinator_id}
              location={event.location}
              image={`data:image/jpeg;base64,${event.image.toString("base64")}`}
              event_start={event.event_start}
              onClick={() => router.push(`/admin/events/${event.id}`)}
            />
          ))}
        </div>
      </Content>
    </Layout>
  );
};

export default AdminEvents;
