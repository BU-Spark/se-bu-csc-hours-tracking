"use server";

import prisma from "../../../../../lib/prisma";
import { Event } from "@prisma/client";
import { Buffer } from "buffer";

interface ExtendedEvent extends Partial<Omit<Event, "id" | "coordinator_id">> {
  coordinator_name: string;
  coordinator_email: string;
}

export async function getEvent(eventId: number) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (event) {
      const base64Image = event.image
        ? Buffer.from(event.image).toString("base64")
        : "";
      return { ...event, image: base64Image };
    }

    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export async function updateEvent(eventId: number, eventData: ExtendedEvent) {
  try {
    const {
      category_id,
      coordinator_name,
      coordinator_email,
      organization_id,
      ...data
    } = eventData;
    const coordinator = await prisma.person.findUnique({
      where: { email: coordinator_email },
    });

    if (!coordinator) {
      throw new Error(
        `Coordinator with name ${coordinator_name} and email ${coordinator_email} not found`
      );
    }

    if (data.image && typeof data.image === "string") {
      data.image = Buffer.from(data.image, "base64");
    }

    const updateData: any = {
      ...data,
      category: { connect: { id: category_id } },
      coordinator: { connect: { id: coordinator.id } },
    };

    if (organization_id) {
      updateData.organization = { connect: { id: organization_id } };
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });
    return updatedEvent;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function createEvent(eventData: ExtendedEvent) {
  try {
    const {
      category_id,
      coordinator_name,
      coordinator_email,
      organization_id,
      ...data
    } = eventData;
    const coordinator = await prisma.person.findUnique({
      where: { email: coordinator_email },
    });

    if (!coordinator) {
      throw new Error(
        `Coordinator with name ${coordinator_name} and email ${coordinator_email} not found`
      );
    }

    if (typeof data.image === "string") {
      data.image = Buffer.from(data.image, "base64");
    }

    const createData: any = {
      ...data,
      category: { connect: { id: category_id } },
      coordinator: { connect: { id: coordinator.id } },
    };

    if (organization_id) {
      createData.organization = { connect: { id: organization_id } };
    }

    const newEvent = await prisma.event.create({
      data: createData,
    });
    return newEvent;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function getEvents() {
  try {
    const events = await prisma.event.findMany();
    return events.map((event) => ({
      ...event,
      image: event.image ? Buffer.from(event.image).toString("base64") : "",
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
