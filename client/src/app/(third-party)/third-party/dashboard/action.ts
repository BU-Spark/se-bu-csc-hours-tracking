"use server";

import { Feedback } from "@/interfaces/interfaces";
import { getPersonFromUser } from "@/lib/getPersonFromUser";
import prisma from "@/lib/prisma";
import { Category, Event, Organization, Person } from "@prisma/client";
import { Buffer } from "buffer";

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
  console.log("updating evet");
  try {
    const {
      category_id,
      coordinator_name,
      coordinator_email,
      organization_id,
      coordinator_id,
      form_id,
      ...data
    } = eventData;
    console.log(eventData);
    const coordinator = await prisma.person.findFirst({
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
      application_password: data.password,
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
    return null; // Explicitly return null in case of error
  }
};


// Function to get the approval status IDs
async function getApprovalStatusIds() {
  const statuses = await prisma.approvalStatusCode.findMany({
    where: {
      meaning: {
        in: ["Pending", "Approved"],
      },
    },
  });

  const statusMap: { [key: string]: number } = {};
  statuses.forEach((status) => {
    statusMap[status.meaning] = status.id;
  });

  return statusMap;
}

// Fetch pending submissions for the organization's events
export const getPendingSubmissions = async (organizationId: number) => {
  try {
    const { Pending } = await getApprovalStatusIds();

    const submissions = await prisma.hourSubmission.findMany({
      where: {
        approval_status: Pending,
        event: {
          organization_id: organizationId,
        },
      },
      include: {
        volunteer: true,
        event: true,
      },
    });

    return submissions;
  } catch (error) {
    console.error("Error fetching pending submissions:", error);
    return [];
  }
};

// Fetch stats for the organization's events
export const getOrganizationStats = async (organizationId: number) => {
  try {
    const { Pending, Approved } = await getApprovalStatusIds();

    const totalSubmissions = await prisma.hourSubmission.count({
      where: {
        event: {
          organization_id: organizationId,
        },
      },
    });

    const approvedSubmissions = await prisma.hourSubmission.count({
      where: {
        approval_status: Approved,
        event: {
          organization_id: organizationId,
        },
      },
    });

    const pendingSubmissions = await prisma.hourSubmission.count({
      where: {
        approval_status: Pending,
        event: {
          organization_id: organizationId,
        },
      },
    });

    const totalHoursLoggedResult = await prisma.hourSubmission.aggregate({
      where: {
        approval_status: Approved,
        event: {
          organization_id: organizationId,
        },
      },
      _sum: {
        hours: true,
      },
    });

    const pendingHoursResult = await prisma.hourSubmission.aggregate({
      where: {
        approval_status: Pending,
        event: {
          organization_id: organizationId,
        },
      },
      _sum: {
        hours: true,
      },
    });

    return {
      totalSubmissions,
      approvedSubmissions,
      pendingSubmissions,
      totalHoursLogged: totalHoursLoggedResult._sum.hours || 0,
      pendingHours: pendingHoursResult._sum.hours || 0,
    };
  } catch (error) {
    console.error("Error fetching organization stats:", error);
    return null;
  }
};

// Fetch events submitted to BU CSC by the organization
export const getSubmittedEvents = async (organizationId: number) => {
  try {
    // Since 'Event' doesn't have 'approval_status', we'll use 'Application' to infer submissions.
    const events = await prisma.event.findMany({
      where: {
        organization_id: organizationId,
      },
      include: {
        applications: {
          select: {
            approval_status: true,
          },
        },
      },
    });

    // Get ApprovalStatusCodes
    const approvalStatusCodes = await prisma.approvalStatusCode.findMany();
    const statusMap: { [key: number]: string } = {};
    approvalStatusCodes.forEach((status) => {
      statusMap[status.id] = status.meaning;
    });

    // Prepare the list of events with approval status
    const submittedEvents = events
      .filter((event) => event.applications.length > 0)
      .map((event) => {
        // Assume event status is pending if any application is pending
        const isPending = event.applications.some(
          (app) => statusMap[app.approval_status] === "Pending"
        );
        return {
          id: event.id,
          title: event.title,
          event_start: event.event_start,
          approval_status: isPending ? "Pending" : "Approved",
        };
      });

    return submittedEvents;
  } catch (error) {
    console.error("Error fetching submitted events:", error);
    return [];
  }
};