"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CreateEventForm from "./CreateEventForm";
import { createEvent } from "../action";
import { Event } from "@prisma/client";

const NewEventPage: React.FC = () => {
  const router = useRouter();

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      await createEvent(eventData as Omit<Event, "id">);

      router.push("/third-party/my-events");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div>
      <h1>Create New Event</h1>
      <CreateEventForm
        onUpdate={handleCreateEvent}
        onCancel={() => router.push("/third-party/events")}
      />
    </div>
  );
};

export default NewEventPage;
