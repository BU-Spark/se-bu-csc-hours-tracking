"use server";

import { Feedback } from "@/interfaces/interfaces";
import { getPersonFromUser } from "@/lib/getPersonFromUser";
import prisma from "@/lib/prisma";
import { Category, Event, Organization, Person } from "@prisma/client";
import { Buffer } from "buffer";
import { get } from "http";

interface ExtendedEvent extends Partial<Event> {
  coordinator_name: string;
  coordinator_email: string;
}

export async function getEvent(eventId: number) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (event) {
      const base64Image = event.image
        ? Buffer.from(event.image).toString("base64")
        : "";
      return { ...event, image: base64Image };
    }

    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export async function updateEvent(eventId: number, eventData: any) {
  try {
    const {
      category_id,
      coordinator_name,
      coordinator_email,
      organization_id,
      coordinator_id,
      form_id,
      password,
      ...data
    } = eventData;
 
    // const coordinator = await prisma.person.findFirst({
    //   where: { email: coordinator_email },
    // });

    // if (!coordinator) {
    //   throw new Error(
    //     `Coordinator with name ${coordinator_name} and email ${coordinator_email} not found`
    //   );
    // }

    if (data.image && typeof data.image === "string") {
      data.image = Buffer.from(data.image, "base64");
    }

    const updateData: any = {
      ...data,
      application_password: password,
      category: { connect: { id: category_id } },
      // coordinator: { connect: { id: coordinator.id } },
    };

    if (organization_id) {
      updateData.organization = { connect: { id: organization_id } };
    }

    const { id, ...dataWithoutEventId } = updateData;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: dataWithoutEventId,
    });
    return "success";
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function createEvent(eventData: ExtendedEvent | any) {
  try {
    const {
      category_id,
      coordinator_id,
      organization_id,
      password,
      ...data
    } = eventData;

    if (typeof data.image === "string") {
      data.image = Buffer.from(data.image, "base64");
    }

    const createData: any = {
      ...data,
      application_password: password,
      category: { connect: { id: category_id } },
      coordinator: { connect: { id: coordinator_id } },
    };

    if (organization_id) {
      createData.organization = { connect: { id: organization_id } };
    }

    const newEvent = await prisma.event.create({
      data: { ...createData },
    });
    return newEvent;
  } catch (error) {
    //this may be an issue later
    console.log("Error creating event:", error);
    return;
  }
}

// export async function getEvents() {
//   try {
//     const events = await prisma.event.findMany();
//     return events.map((event) => ({
//       ...event,
//       image: event.image ? Buffer.from(event.image).toString("base64") : "",
//     }));
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     throw error;
//   }
// }
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

export const getOrganizations = async (): Promise<
  Organization[] | undefined
> => {
  try {
    const organization = await prisma.organization.findMany();
    if (!organization) {
      console.error("erroring retrieving organization");
      return;
    }
    return organization;
  } catch (error) {
    console.error(error);
  }
};

export const getCategories = async (): Promise<Category[] | undefined> => {
  try {
    const category = await prisma.category.findMany();
    if (!category) {
      console.error("erroring retrieving categories");
      return;
    }
    return category;
  } catch (error) {
    console.error(error);
  }
};

export const getFeedback = async (orgId: number): Promise<Feedback[] | undefined> => {
  try {
    const rawFeedback = await prisma.hourSubmission.findMany({
      where: { event: { organization_id: orgId } },
      select: {
        id: true,
        event: true,
        volunteer: true,
        date_submitted: true,
        feedback: true,
      },
      orderBy: {
        date_submitted: "desc",
      },
      take: 8,
    });
    if (!rawFeedback) {
      console.error("erroring retrieving feedback");
      return;
    }
    const feedback: Feedback[] = rawFeedback.map((item) => ({
      id: item.id || 1,
      author: { id: item.volunteer.id, name: item.volunteer.name }, // Assuming volunteer matches Person type
      event: item.event, // Assuming event matches Event type
      content: item.feedback,
      dateWritten: item.date_submitted,
    }));

    return feedback;
  } catch (error) {
    console.error(error);
  }
};

//get events by organizer id
export const getEventsByOrganizerId = async (id: number): Promise<Event[]> => {
  try {
    const events = await prisma.event.findMany({
      where: { organization_id: id },
    });
    return events;
  } catch (error) {
    console.error(error);
    return [];
  }
};

//get oganizaiton by user id - could also just store org in session data
//access stuff w/ org?.affiliation?.id or .name, .abbreviation
export const getOrganizationByUserId = async (clerk_id: string) => {
  try {
    const person = await getPersonFromUser(clerk_id);
    const affiliation_id = person.affiliation_id;
    const organization = await prisma.organization.findUnique({
      where: { id: affiliation_id },
    });
    return organization;
  } catch (error) {
    console.error(error);
  }
};

