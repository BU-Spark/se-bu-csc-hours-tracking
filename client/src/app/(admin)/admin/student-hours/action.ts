'use server'
import {
  HoursTableData,
  ProcessSubmissionParams,
} from "@/interfaces/interfaces";
import prisma from "@/lib/prisma";
import { HourSubmission } from "@prisma/client";

export async function getPendingSubmissions(): Promise<
  HourSubmission[] | undefined
> {
  try {
    const pendingSubmisions: HourSubmission[] =
      await prisma.hourSubmission.findMany({ where: { approval_status: 0 } });
    if (!pendingSubmisions) {
      console.error("Failure in retrieving");
    }

    return pendingSubmisions;
  } catch (error) {
    console.error(error);
  }
}

export async function getHourSubmissionTableData(): Promise<
  | { pendingHourRows: HoursTableData[]; reviewHourRows: HoursTableData[] }
  | undefined
> {
  try {
    const pendingSubmissions: any[] = await prisma.hourSubmission.findMany({
      where: { approval_status: 0 },
      select: {
        event: { select: { category: true } },
        volunteer: { select: { name: true, college: true, bu_id: true } },
        id: true,
        date_submitted: true,
        approval_status: true,
        hours: true,
        updated_by: true,
        description: true,
      },
    });
    const reviewedSubmissions: any[] = await prisma.hourSubmission.findMany({
      where: {
        approval_status: { not: 0 },
      },
      select: {
        event: { select: { category: true } },
        volunteer: { select: { name: true, college: true } },
        id: true,
        date_submitted: true,
        approval_status: true,
        hours: true,
        updated_by: true,
        description: true,
      },
    });
    if (!pendingSubmissions || reviewedSubmissions) {
      console.error("Failure in retrieving");
    }

    const pendingHourRows: HoursTableData[] = pendingSubmissions.map(
      (submission) => ({
        key: submission.id.toString(),
        submissionId: submission.id.toString(),
        studentName: submission.volunteer.name,
        buId: submission.volunteer.bu_id,
        college: submission.volunteer.college,
        category: submission.event.category.name,
        dateSubmitted: submission.date_submitted,
        description: submission.description,
        hours: submission.hours,
        approvalStatus: submission.approval_status,
        updatedBy: submission.updated_by.name,
      })
    );

    const reviewHourRows: HoursTableData[] = reviewedSubmissions.map(
      (submission) => ({
        key: submission.id.toString(),
        submissionId: submission.id.toString(),
        studentName: submission.volunteer.name,
        buId: submission.volunteer.bu_id,
        college: submission.volunteer.college,
        category: submission.event.category.name,
        dateSubmitted: submission.date_submitted,
        description: submission.description,
        hours: submission.hours,
        approvalStatus: submission.approval_status,
        updatedBy: submission.updated_by.name,
      })
    );

    return {
      pendingHourRows: pendingHourRows,
      reviewHourRows: reviewHourRows,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function reviewHourSubmission(
  data: ProcessSubmissionParams
): Promise<any> {
  const { submissionId, updaterId, approvalStatus } = data;
  try {
    const response = prisma.hourSubmission.update({
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