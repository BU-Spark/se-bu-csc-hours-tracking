"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getToken } from "next-auth/jwt";
import { CreateNewHourSubmissionParams } from "@/interfaces/interfaces";
import { Event, HourSubmission } from "@prisma/client";

export async function createNewHourSubmission({
  eventId,
  userId,
  hours,
  feedback,
  description,
}: CreateNewHourSubmissionParams) {
  try {
    if (!userId) {
      console.error("Unauthorized: No id given");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.person.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let eventData = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        event_start: true,
        event_end: true,
        reg_start: true,
        reg_end: true,
        estimated_participants: true,
        location: true,
        transit: true,
        description: true,
        category_id: true,
        coordinator_id: true,
        form_id: true,
        organization_id: true,
      },
    });

    if (!eventData) {
      console.error("Event not found");
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const newHourSubmission: HourSubmission =
      await prisma.hourSubmission.create({
        data: {
          hours: hours,
          note: feedback,
          description: description,
          event: {
            connect: { id: eventData.id },
          },
          volunteer: {
            connect: { id: user.id },
          },
          approval_status: 0,
          date_submitted: new Date(),
          updated_at: new Date(),
          deleted_by_id: undefined,
          deleted_at: undefined,
          updated_by: {
            connect: { id: userId },
          },
        },
      });

    return newHourSubmission;
  } catch (error) {
    console.error("Error adding hours:", error);
    return NextResponse.json({ error: "Error adding hours" }, { status: 500 });
  }
}


export const getAllApprovedEventsByUserId = async (
  userId: number
): Promise<Event[] | undefined> => {
  try {
    // Get all approved applications for the user
    const approvedApplications = await prisma.application.findMany({
      where: {
        applicant_id: userId,
        approved: true,
      },
      include: {
        event: true,
      },
    });

    // Extract event IDs from approved applications
    const eventIdsWithApplications = approvedApplications.map(
      (application) => application.event_id
    );

    // Get all hour submissions for the user
    const hourSubmissions = await prisma.hourSubmission.findMany({
      where: {
        volunteer_id: userId,
      },
      select: {
        event_id: true,
      },
    });

    // Extract event IDs from hour submissions
    const eventIdsWithSubmissions = hourSubmissions.map(
      (submission) => submission.event_id
    );

    // Retrieve all events
    const allEvents = await prisma.event.findMany({
      where: {
        id: {
          in: eventIdsWithApplications,
        },
        event_end: {
          lte: new Date(),
        },
      },
    });

    // Filter events where there is an approved application but no hour submission
    const eventsWithoutSubmissions = allEvents.filter(
      (event) =>
        eventIdsWithApplications.includes(event.id) &&
        !eventIdsWithSubmissions.includes(event.id)
    );

    return eventsWithoutSubmissions;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};