"use server";
import { EventApplicationsTableData } from "@/interfaces/interfaces";
import prisma from "@/lib/prisma";
import { Application } from "@prisma/client";

export const getAllPendingApplications = async (): Promise<
  Application[] | undefined
> => {
  try {
    const pendingAppications = await prisma.application.findMany({
      where: { approval_status: 0 },
    });
    if (!pendingAppications)
      console.error("error in fetching pendingApplications");
    return pendingAppications;
  } catch (error) {
    console.error(error);
  }
};

export async function getEventApplicationsTableData(): Promise<
  | {
      pendingApplicationRows: EventApplicationsTableData[];
      reviewedApplicationRows: EventApplicationsTableData[];
    }
  | undefined
> {
  try {
    const pendingApplications: any[] = await prisma.application.findMany({
      where: { approval_status: 0 },
      select: {
        event: {
          select: {
            id: true,
            title: true,
            estimated_participants: true,
          },
        },
        applicant: { select: { name: true, college: true, class: true } },
        id: true,
        date_applied: true,
        approval_status: true,
        updated_by: true,
        reason: true,
      },
    });
    const reviewedApplications: any[] = await prisma.application.findMany({
      where: { approval_status: { not: 0 } },
      select: {
        event: {
          select: {
            id: true,
            title: true,
            estimated_participants: true,
          },
        },
        applicant: { select: { name: true, college: true, class: true } },
        id: true,
        date_applied: true,
        approval_status: true,
        updated_by: true,
        reason: true,
      },
    });
    if (!pendingApplications || reviewedApplications) {
      console.error("Failure in retrieving");
    }

    console.log("pendingSubmisions", pendingApplications);
    console.log("reviewedApplications", reviewedApplications);

    const pendingApplicationRows: EventApplicationsTableData[] =
      pendingApplications.map((application) => ({
        key: application.id.toString(),
        applicationId: application.id.toString(),
        approvalStatus: application.approval_status,
        dateApplied: application.date_applied,
        updatedBy: application.updated_by.name,
        reason: application.reason,
        studentName: application.volunteer.name,
        class: application.volunteer.class,
        college: application.volunteer.college,
        eventId: application.event.id,
        eventTitle: application.event.title,
        estimatedParticipants: application.event.estimated_participants,
      }));

    const reviewedApplicationRows: EventApplicationsTableData[] =
      reviewedApplications.map((application) => ({
        key: application.id.toString(),
        applicationId: application.id.toString(),
        approvalStatus: application.approval_status,
        dateApplied: application.date_applied,
        updatedBy: application.updated_by.name,
        reason: application.reason,
        studentName: application.volunteer.name,
        class: application.volunteer.class,
        college: application.volunteer.college,
        eventId: application.event.id,
        eventTitle: application.event.title,
        estimatedParticipants: application.event.estimated_participants,
      }));

    console.log("pendingApplicationRows", pendingApplicationRows);
    console.log("reviewedApplicationRows", reviewedApplicationRows);

    return {
      pendingApplicationRows: pendingApplicationRows,
      reviewedApplicationRows: reviewedApplicationRows,
    };
  } catch (error) {
    console.error(error);
  }
}
