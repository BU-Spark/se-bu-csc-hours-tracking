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

export async function checkIfApplied(
  eventId: number,
  userId: number
): Promise<boolean> {
  try {
    const applied = await prisma.application.findFirst({
      where: {
        event_id: eventId,
        applicant_id: userId,
      },
    });
    if (applied) return true;
    return false;
  } catch (error) {
    console.error("Error fetching events:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}