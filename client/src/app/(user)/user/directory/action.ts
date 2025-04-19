"use server";

import prisma from "../../../../lib/prisma";
import { Organization, Event, FormCode } from "@prisma/client";

// Interface for organization with their upcoming events
export interface OrganizationWithEvents extends Organization {
  upcomingEvents: Event[];
  requiredForms: FormCode[];
  collaboration_tags?: string[];
}

export const getAllOrganizations = async (): Promise<OrganizationWithEvents[]> => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Fetch all organizations with their events and forms
    const organizations = await prisma.organization.findMany({
      include: {
        events: {
          where: {
            event_start: {
              gte: currentDate
            }
          },
          orderBy: {
            event_start: 'asc'
          },
          take: 3 // Get only the next 3 upcoming events
        }
      }
    });

    // Add placeholder required forms for each organization
    const orgWithEvents: OrganizationWithEvents[] = organizations.map(org => {
      // Mock required forms (in a real scenario, you'd fetch these from the database)
      const mockForms: FormCode[] = [
        {
          id: 1,
          title: "Background Check Form",
          description: "Required for all volunteers",
          downloadable: true,
          required: true,
          organization_id: org.id,
          upload_link: null
        },
        {
          id: 2,
          title: "Liability Waiver",
          description: "Required for all volunteers",
          downloadable: true,
          required: true,
          organization_id: org.id,
          upload_link: null
        }
      ];

      return {
        ...org,
        upcomingEvents: org.events,
        requiredForms: mockForms
      };
    });

    return orgWithEvents;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};

// Function to get organization by ID with upcoming events
export const getOrganizationWithEvents = async (id: number): Promise<OrganizationWithEvents | null> => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Fetch the organization with its events and forms
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        events: {
          where: {
            event_start: {
              gte: currentDate
            }
          },
          orderBy: {
            event_start: 'asc'
          },
          take: 3 // Get only the next 3 upcoming events
        }
      }
    });

    if (!organization) {
      return null;
    }

    // Mock required forms (in a real scenario, you'd fetch these from the database)
    const mockForms: FormCode[] = [
      {
        id: 1,
        title: "Background Check Form",
        description: "Required for all volunteers",
        downloadable: true,
        required: true,
        organization_id: organization.id,
        upload_link: null
      },
      {
        id: 2,
        title: "Liability Waiver",
        description: "Required for all volunteers",
        downloadable: true,
        required: true,
        organization_id: organization.id,
        upload_link: null
      }
    ];

    return {
      ...organization,
      upcomingEvents: organization.events,
      requiredForms: mockForms
    };
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}; 