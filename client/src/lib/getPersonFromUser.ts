import prisma from "./prisma";

export async function getPersonFromUser(clerkId: string) {
  try {
    return await prisma.person.findUnique({
      where: { clerk_id: clerkId },
    });
  } catch (error) {
    return null;
  }
}
