import prisma from "./prisma";

export const getPersonFromUser = async (clerk_id: string) => {
  let person = await prisma.person.findUnique({
    where: { clerk_id: clerk_id },
  });
return person;
}