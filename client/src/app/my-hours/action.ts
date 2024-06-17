"use server";

import { Event, HourSubmission } from "@prisma/client";
import prisma from "../../lib/prisma";

export const getHoursByUserEmail = async (email: string) => {
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
    return [];
  }

  const hourSubmissionsWithEventDetails = await Promise.all(
    user.hour_submissions.map(async (submission: HourSubmission) => {
      const event: Event | null = await prisma.event.findUnique({
        where: { id: submission.event_id },
      });

      if (!event) {
        return null;
      }

      return {
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
        description: submission.description,
        feedback: submission.note,
      };
    })
  );

  // Filter out any null values in case an event was not found
  return hourSubmissionsWithEventDetails.filter(Boolean);
};
