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

export async function getHourSubmissionTableData(): Promise<any | undefined> {
  try {
    const pendingSubmissions: HourSubmission[] =
      await prisma.hourSubmission.findMany({ where: { approval_status: 0 } });
    const reviewedSubmissions: HourSubmission[] =
      await prisma.hourSubmission.findMany({
        where: { approval_status: { not: 0 } },
      });
    if (!pendingSubmissions || reviewedSubmissions) {
      console.error("Failure in retrieving");
    }

    console.log("pendingSubmisions", pendingSubmissions);
    console.log("reviewedSubmissions", reviewedSubmissions);
    return {
      pendingSubmissions: pendingSubmissions,
      reviewedSubmissions: reviewedSubmissions,
    };
  } catch (error) {
    console.error(error);
  }
}