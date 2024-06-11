"use server";
import prisma from "@/app/utils/prisma";
import { Event } from "@/interfaces/interfaces";

export async function getEvent(eventId: number): Promise<any> {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (event) return event;
    else {
      console.error("No event found");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
