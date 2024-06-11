"use server";
import { Person } from "@/interfaces/interfaces";

export const getCoordinatorById = async (coordinatorId: number) => {
  try {
    const result = await prisma?.person.findUnique({
      where: { id: coordinatorId },
    });

    if (result) {
      return result;
    }
    console.error("no coordinator found");
  } catch (error) {
    console.error(error);
  }
};
