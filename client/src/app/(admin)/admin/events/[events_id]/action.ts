"use server";

import { Feedback } from "@/interfaces/interfaces";
import prisma from "../../../../../lib/prisma";
import { Category, Event, Organization, Person } from "@prisma/client";
import { Buffer } from "buffer";

interface ExtendedEvent extends Partial<Omit<Event, "id" | "coordinator_id">> {
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

export async function updateEvent(eventId: number, eventData: ExtendedEvent) {
  try {
    const {
      category_id,
      coordinator_name,
      coordinator_email,
      organization_id,
      ...data
    } = eventData;
    const coordinator = await prisma.person.findUnique({
      where: { email: coordinator_email },
    });

    if (!coordinator) {
      throw new Error(
        `Coordinator with name ${coordinator_name} and email ${coordinator_email} not found`
      );
    }

    if (data.image && typeof data.image === "string") {
      data.image = Buffer.from(data.image, "base64");
    }

    const updateData: any = {
      ...data,
      category: { connect: { id: category_id } },
      coordinator: { connect: { id: coordinator.id } },
    };

    if (organization_id) {
      updateData.organization = { connect: { id: organization_id } };
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });
    return updatedEvent;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function createEvent(eventData: ExtendedEvent) {
  try {
    const {
      category_id,
      coordinator_name,
      coordinator_email,
      organization_id,
      ...data
    } = eventData;
    // const coordinator = await prisma.person.findUnique({
    //   where: { email: coordinator_email },
    // });
    const dummyCoordinator = await prisma.person.findFirst({
      where: { id: 1 },
    });

    if (!dummyCoordinator) {
      throw new Error(
        `Coordinator with name ${coordinator_name} and email ${coordinator_email} not found`
      );
    }

    if (typeof data.image === "string") {
      data.image = Buffer.from(data.image, "base64");
    }

    const createData: any = {
      ...data,
      category: { connect: { id: category_id } },
      coordinator: { connect: { id: dummyCoordinator.id } },
    };

    if (organization_id) {
      createData.organization = { connect: { id: organization_id } };
    }
    console.log("DATA:", createData);

    const newEvent = await prisma.event.create({
      data: createData,
    });
    return newEvent;
  } catch (error) {
    //this may be an issue later
    console.log("Error creating event:", error);
    return;
  }
}

export async function getEvents() {
  try {
    const events = await prisma.event.findMany();
    return events.map((event) => ({
      ...event,
      image: event.image ? Buffer.from(event.image).toString("base64") : "",
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
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

export const getFeedback = async (): Promise<Feedback[] | undefined> => {
  try {
    const rawFeedback = await prisma.hourSubmission.findMany({
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