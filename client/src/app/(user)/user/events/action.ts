"use server";
import prisma from "../../../_utils/prisma";
import { EventInput } from "@/interfaces/interfaces";
import { Role, Person, Event } from "@prisma/client";
import { randomInt } from "crypto";
import fs from "fs/promises";

export async function getEvents(): Promise<Event[]> {
  try {
    const events: Event[] = await prisma.event.findMany();
    return events;
  } catch (error) {
    console.error("Error fetching forms:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// export async function createEvent(eventData: EventInput): Promise<Event> {
//   try {
//     const createdEvent = await prisma.event.create({
//       data: eventData,
//     });
//     return createdEvent;
//   } catch (error) {
//     throw new Error(`Failed to create event: ${error}`);
//   }
// }

export async function createDummyEvent(eventData: EventInput): Promise<void> {
  // try {
  //   const imageFilePath = eventData.image;
  //   // Read the image file as a byte array
  //   const imageBytes = await fs.readFile(imageFilePath);

  //   if (
  //     !(await prisma.category.findUnique({
  //       where: {
  //         id: 1,
  //       },
  //     }))
  //   ) {
  //     await prisma.category.create({
  //       data: {
  //         name: "Dummy Category",
  //       },
  //     });
  //     await prisma.organization.create({
  //       data: {
  //         name: "Dummy Organization",
  //         abbreviation: "DUM",
  //       },
  //     });
  //     await prisma.person.create({
  //       data: {
  //         name: "Dummy Person",
  //         email: "dummy@gmail.com" + randomInt(1000),
  //         phone_number: Math.floor(
  //           100000000 + Math.random() * 900000000
  //         ).toString(),
  //         class: 2026,
  //         affiliation_id: 1,
  //       },
  //     });
  //     console.log("made new person, org, category");
  //   }

  //   // Create the event with the image
  //   const newEvent = await prisma.event.create({
  //     data: {
  //       ...eventData,
  //       coordinator_id: 1,
  //       category_id: 1,
  //       organization_id: 1,
  //       image: imageBytes,
  //     },
  //   });

  //   // console.log("Event with image created successfully.", newEvent);
  // } catch (error) {
  //   console.error("Error creating event with image:", error);
  // }
}

//get user by email for other functions
export const getUserByEmail = async (
  email: string
): Promise<Person | undefined> => {
  try {
    const user = await prisma.person.findUnique({ where: { email: email } });
    if (!user) return;

    return user;
  } catch (error) {
    console.error(error);
    return;
  }
};

//get applications to events per user
export const getApplicationsByUserId = async (id: number) => {
  try {
    const applications = prisma.application.findMany({
      where: { applicant_id: id },
    });
    return applications;
  } catch (error) {
    console.error(error);
  }
};

//get events by application ids
export const getEventsByApplicationEventIds = async (
  ids: number[]
): Promise<Event[] | undefined> => {
  try {
    const currentTime = new Date();
    const events: Event[] = await prisma.event.findMany({
      where: {
        id: {
          in: ids,
        },
        event_start: {
          gt: currentTime, // Only include events where event_start is after the current time
        },
      },
    });
    return events;
  } catch (error) {
    console.error(error);
  }
};
