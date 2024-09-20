"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdminEventForm from "./AdminEventForm";
import { createEvent } from "../[events_id]/action";
import { Event } from "@prisma/client";

const NewEventPage: React.FC = () => {
  const router = useRouter();

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      await createEvent(eventData as Omit<Event, "id">);

      router.push("/admin/events");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div>
      <h1>Create New Event</h1>
      <AdminEventForm
        onUpdate={handleCreateEvent}
        onCancel={() => router.push("/admin/events")}
      />
    </div>
  );
};

export default NewEventPage;
