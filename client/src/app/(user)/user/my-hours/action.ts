"use server";

import { Event, HourSubmission, Organization } from "@prisma/client";
import prisma from "@/lib/prisma";
import { EventHours } from "@/interfaces/interfaces";

export const getHourSubmissionsByUserEmail = async (
  email: string
): Promise<any[]> => {
  const user = await prisma.person.findUnique({
    where: { email },
    include: {
      hour_submissions: {
        include: {
          event: true,
          updated_by: true,
        },
      },
    },
  });

  if (!user) {
    console.log("No user found with the provided email.");
    return [];
  }

  console.log("user:", user);

  const hourSubmissionsWithEventDetails = await Promise.all(
    user.hour_submissions.map(async (submission: HourSubmission) => {
      const event: Event | null = await prisma.event.findUnique({
        where: { id: submission.event_id },
      });

      const organization: Organization | null =
        await prisma.organization.findUnique({
          where: { id: event?.organization_id },
        });

      if (!event || !organization) {
        return null;
      }

      const fullEvent: EventHours = {
        id: submission.id,
        image: event.image.toString("base64"),
        eventName: event.title,
        location: event.location,
        status: submission.approval_status === 1 ? "approved" : "pending",
        date: submission.date_submitted.toString(),
        reviewer:
          submission.updated_by_id !== user.id
            ? submission.updated_by_id
            : "N/A",
        hours: submission.hours,
        description: submission.description ? submission.description : "",
        organization: organization.name,
        feedback: submission.note,
        approval_status: submission.approval_status,
      };
      return fullEvent;
    })
  );

  // Filter out any null values in case an event was not found
  const filteredHourSubmissions =
    hourSubmissionsWithEventDetails.filter(Boolean);

  filteredHourSubmissions.sort((a, b) => {
    if (!a || !b) return 0;
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return filteredHourSubmissions;
};

export const getUpcomingHoursByUser = async (
  userId: number
): Promise<Number | undefined> => {
  try {
    const futureHourSubmissions = await prisma.hourSubmission.findMany({
      where: {
        volunteer_id: userId,
        approval_status: 1, // Assuming 1 means approved
        event: {
          event_start: {
            // Filter events that are in the future
            gte: new Date(), // Only include events that haven't happened yet
          },
        },
      },
      include: {
        event: true,
      },
    });

    const totalHours = futureHourSubmissions.reduce(
      (acc, submission) => acc + submission.hours,
      0
    );

    return totalHours;
  } catch (error) {
    console.error(error);
  }
};
