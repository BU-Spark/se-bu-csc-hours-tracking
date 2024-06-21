'use server'
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