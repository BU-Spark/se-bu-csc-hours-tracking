'use server'
import { HoursTableData } from "@/interfaces/interfaces";
import prisma from "@/lib/prisma";
import { HourSubmission } from "@prisma/client";

export async function getPendingSubmissions(): Promise<HourSubmission[] | undefined> {
    try {
        const pendingSubmisions: HourSubmission[] = await prisma.hourSubmission.findMany({where: {approval_status: 0}})
        if(!pendingSubmisions){console.error('Failure in retrieving')}
        
        console.log('pendingSubmisions', pendingSubmisions)
        return pendingSubmisions
    } catch (error) {
        console.error(error)
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
        volunteer: { select: { name: true, college: true } },
        id: true,
        date_submitted: true,
        approval_status: true,
        hours: true,
      },
    });
    const reviewedSubmissions: any[] = await prisma.hourSubmission.findMany({
      where: {
        approval_status: { not: 0 },
      },
      select: {
        event: true,
        volunteer: true,
        id: true,
        date_submitted: true,
        approval_status: true,
      },
    });
    if (!pendingSubmissions || reviewedSubmissions) {
      console.error("Failure in retrieving");
    }

    console.log("pendingSubmisions", pendingSubmissions);
    console.log("reviewedSubmissions", reviewedSubmissions);

    const pendingHourRows: HoursTableData[] = pendingSubmissions.map(
      (submission) => ({
        key: submission.id.toString(),
        submissionId: submission.id.toString(),
        studentName: submission.volunteer.name,
        college: submission.volunteer.college,
        category: submission.event.category.name,
        dateSubmitted: submission.date_submitted,
        hours: submission.hours,
        approvalStatus: submission.approval_status,
      })
    );

    const reviewHourRows: HoursTableData[] = reviewedSubmissions.map(
      (submission) => ({
        key: submission.id.toString(),
        submissionId: submission.id.toString(),
        studentName: submission.volunteer.name,
        college: submission.volunteer.college,
        category: submission.event.category.name,
        dateSubmitted: submission.date_submitted,
        hours: submission.hours,
        approvalStatus: submission.approval_status,
      })
    );

    console.log("pendingHourRows", pendingHourRows);
    console.log("reviewHourRows", reviewHourRows);

    return {
      pendingHourRows: pendingHourRows,
      reviewHourRows: reviewHourRows,
    };
  } catch (error) {
    console.error(error);
  }
}