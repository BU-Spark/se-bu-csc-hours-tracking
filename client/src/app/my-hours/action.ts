"use server";

import prisma from '../../lib/prisma';

interface HourSubmission {
  id: number;
  hours: number;
  date_submitted: Date;
  approval_status: number;
  event: Event;
  updated_by?: { name: string };
}

interface Event {
  id: number;
  title: string;
  location: string;
  image: string;
}

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

  return user.hour_submissions.map((submission: HourSubmission) => ({
    id: submission.id,
    image: submission.event.image || '/default.png',
    eventName: submission.event.title,
    location: submission.event.location,
    status: submission.approval_status === 1 ? 'approved' : 'pending',
    date: submission.date_submitted.toString(),
    reviewer: submission.updated_by?.name || 'N/A',
    hours: submission.hours,
  }));
};
