"use server";
import {
  EventApplicationsTableData,
  ProcessSubmissionParams,
} from "@/interfaces/interfaces";
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
        applicant: {
          select: { name: true, college: true, class: true, bu_id: true },
        },
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
        applicant: {
          select: { name: true, college: true, class: true, bu_id: true },
        },
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

    // console.log("pendingSubmisions", pendingApplications);
    // console.log("reviewedApplications", reviewedApplications);

    const pendingApplicationRows: EventApplicationsTableData[] =
      pendingApplications.map((application) => ({
        key: application.id.toString(),
        applicationId: application.id.toString(),
        approvalStatus: application.approval_status,
        dateApplied: application.date_applied,
        updatedBy: application.updated_by.name,
        reason: application.reason,
        studentName: application.applicant.name,
        buId: application.applicant.bu_id,
        class: application.applicant.class,
        college: application.applicant.college,
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
        studentName: application.applicant.name,
        buId: application.applicant.bu_id,
        class: application.applicant.class,
        college: application.applicant.college,
        eventId: application.event.id,
        eventTitle: application.event.title,
        estimatedParticipants: application.event.estimated_participants,
      }));

    // console.log("pendingApplicationRows", pendingApplicationRows);
    // console.log("reviewedApplicationRows", reviewedApplicationRows);

    return {
      pendingApplicationRows: pendingApplicationRows,
      reviewedApplicationRows: reviewedApplicationRows,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function reviewEventApplication(
  data: ProcessSubmissionParams
): Promise<any> {
  const { submissionId, updaterId, approvalStatus } = data;
  try {
    const response = prisma.application.update({
      where: { id: submissionId },
      data: {
        updated_by_id: updaterId,
        approval_status: approvalStatus,
        updated_at: new Date(),
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const getEventSpotsLeft = async (
  eventId: number
): Promise<number | undefined> => {
  try {
    const approvedApplicants = await prisma.application.findMany({
      where: { event_id: eventId, approval_status: 1 },
    });

    const event = await prisma.event.findFirst({
      where: { id: eventId },
      select: {
        estimated_participants: true,
      },
    });

    if (!approvedApplicants || !event) {
      console.error("error retrieving applications approved");
      return;
    }

    return event.estimated_participants - approvedApplicants.length;
  } catch (error) {
    console.error(error);
  }
};