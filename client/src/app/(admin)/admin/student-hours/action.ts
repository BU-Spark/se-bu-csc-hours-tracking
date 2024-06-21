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
    const pendingSubmisions: HourSubmission[] =
      await prisma.hourSubmission.findMany({ where: { approval_status: 0 } });
    const reviewedSubmissions: HourSubmission[] =
      await prisma.hourSubmission.findMany({
        where: { approval_status: { not: 0 } },
      });
    if (!pendingSubmisions || reviewedSubmissions) {
      console.error("Failure in retrieving");
    }

    console.log("pendingSubmisions", pendingSubmisions);
    console.log("reviewedSubmissions", reviewedSubmissions);
    return {
      pendingSubmisions: pendingSubmisions,
      reviewedSubmissions: reviewedSubmissions,
    };
  } catch (error) {
    console.error(error);
  }
}