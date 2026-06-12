"use server";
import { requirePerson } from "@/lib/auth";
import prisma from "@/app/_utils/prisma";
import { Event } from "@prisma/client";
import { Application, Reason } from "@prisma/client";
import { Waitlist } from "@prisma/client";

async function requireSelf(userId: number) {
  const person = await requirePerson(["USER", "ADMIN"]);
  if (person.id !== userId) {
    throw new Error("Unauthorized");
  }
  return person;
}

export async function getEvent(eventId: number): Promise<any> {
  await requirePerson(["USER", "ADMIN"]);
  try {
    const event: Event | null = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        title: true,
        event_start: true,
        event_end: true,
        reg_start: true,
        reg_end: true,
        estimated_participants: true,
        approval_status: true,
        location: true,
        transit: true,
        description: true,
        category_id: true,
        coordinator_id: true,
        form_id: true,
        organization_id: true,
        image: true,
        application_password: true,
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
  await requireSelf(userId);
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

export async function checkIfWaitlisted(
  eventId: number,
  userId: number
): Promise<boolean> {
  await requireSelf(userId);
  try {
    const waitlisted = await prisma.waitlist.findFirst({
      where: {
        event_id: eventId,
        applicant_id: userId,
      },
    });
    if (waitlisted) return true;
    return false;
  } catch (error) {
    console.error("Error fetching events:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function checkIfAcceptedApplication(
  eventId: number,
  userId: number
): Promise<boolean> {
  await requireSelf(userId);
  try {
    const accepted = await prisma.application.findFirst({
      where: {
        event_id: eventId,
        applicant_id: userId,
        approval_status: 1,
      },
    });
    if (accepted) return true;
    return false;
  } catch (error) {
    console.error("Error fetching events:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function cancelSignUp(
  eventId: number,
  userId: number
): Promise<boolean> {
  await requireSelf(userId);
  try {
    const result = await prisma.application.deleteMany({
      where: {
        event_id: eventId,
        applicant_id: userId,
        approval_status: 1,
      },
    });
    const firstRow = await prisma.waitlist.findFirst({
      where: {
        event_id: eventId,
      },
    });
    if (!firstRow) {
      return result.count > 0;
    }
    await prisma.application.create({
      data: {
        date_applied: new Date(),
        reason_id: firstRow.reason_id,
        approval_status: 0,
        applicant_id: firstRow.applicant_id,
        event_id: firstRow.event_id,
        updated_by_id: firstRow.applicant_id,
        updated_at: new Date(),
      },
    });
    await prisma.waitlist.delete({
      where: {
        id: firstRow.id,
      },
    });
    console.log(result.count);
    return result.count > 0;
  } catch (error) {
    console.error("Error unsigning up:", error);
    return false;
  }
}

export async function getWaitlistCount(eventId: number): Promise<boolean> {
  await requirePerson(["USER", "ADMIN"]);
  const response = await prisma.waitlist.findMany({
    where: {
      event_id: eventId,
    },
  });
  if (response.length > 0) {
    return true;
  } else {
    return false;
  }
}

export async function moveOffWaitlist(
  eventId: number,
  capacity: number
): Promise<boolean> {
  await requirePerson(["ADMIN"]);
  try {
    const Rows = await prisma.waitlist.findMany({
      where: {
        event_id: eventId,
      },
      take: capacity,
    });
    if (!Rows) {
      return false;
    }
    for (const row of Rows) {
      const application = await prisma.application.createMany({
        data: {
          date_applied: new Date(),
          reason_id: row.reason_id,
          approval_status: 0,
          applicant_id: row.applicant_id,
          event_id: row.event_id,
          updated_by_id: row.applicant_id,
          updated_at: new Date(),
        },
      });
      await prisma.waitlist.delete({
        where: {
          id: row.id,
        },
      });
      if (!application) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  } catch (error) {
    console.error("Error moving off waitlist:", error);
    return false;
  }
}

export async function createApplication(
  event_id: number,
  userId: number,
  reason: number
): Promise<Application | undefined> {
  await requireSelf(userId);
  try {
    const application = await prisma.application.create({
      data: {
        date_applied: new Date(),
        reason_id: reason,
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

export async function createWaitlist(
  event_id: number,
  userId: number,
  reason: number
): Promise<Waitlist | undefined> {
  await requireSelf(userId);
  try {
    const waitlist = await prisma.waitlist.create({
      data: {
        date_applied: new Date(),
        reason_id: reason,
        approval_status: 0,
        applicant_id: userId,
        event_id: event_id,
        updated_by_id: userId,
        updated_at: new Date(),
      },
    });

    if (waitlist) return waitlist;
  } catch (error) {
    console.log(error);
  }
}

export const getReasons = async (): Promise<Reason[] | undefined> => {
  await requirePerson(["USER", "ADMIN"]);
  try {
    const reasons = await prisma.reason.findMany();
    if (!reasons) {
      console.error("erroring retrieving reasons");
      return;
    }
    return reasons;
  } catch (error) {
    console.error(error);
  }
};
