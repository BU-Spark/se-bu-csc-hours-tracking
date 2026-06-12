import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Person, Role } from "@prisma/client";

export async function requirePerson(
  allowedRoles?: Role[]
): Promise<Person> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await prisma.person.findUnique({
    where: { clerk_id: userId },
  });

  if (!person) {
    throw new Error("Person not found");
  }

  if (allowedRoles && !allowedRoles.includes(person.role)) {
    throw new Error("Unauthorized");
  }

  return person;
}
