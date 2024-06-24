"use server";
import prisma from "@/app/_utils/prisma";
import { Event } from "@/interfaces/interfaces";
import { Application } from "@prisma/client";

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

export async function createApplication(
  event_id: number,
  userId: number
): Promise<Application | undefined> {
  try {
    const application = await prisma.application.create({
      data: {
        date_applied: new Date(),
        reason_id: 1, //FIX REASON
        approval_status: 0,
        applicant_id: userId,
        event_id: event_id,
        updated_by_id: userId,
        updated_at: new Date(),
      },
    });

    if (application) return application;
  } catch (error) {
    console.log(error);
  }
}