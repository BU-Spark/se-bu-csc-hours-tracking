"use server";
import prisma from "../utils/prisma";
import { Event, EventInput } from "@/interfaces/interfaces";

export async function getEvents(): Promise<Event[]> {
  try {
    const events: Event[] = await prisma.event.findMany();
    return events;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createEvent(eventData: EventInput): Promise<Event> {
  try {
    const createdEvent = await prisma.event.create({
      data: eventData,
    });
    console.log(createEvent);
    return createdEvent;
  } catch (error) {
    throw new Error(`Failed to create event: ${error}`);
  }
}
