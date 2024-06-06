"use server";
import prisma from "../utils/prisma";
import { Event } from "@/interfaces/interfaces";

export async function getEvents(): Promise<Event[]> {
  try {
    const events: Event[] = await prisma.event.findMany();
    return events;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
