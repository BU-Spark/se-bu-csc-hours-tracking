"use server";

import { getPersonFromUser } from "@/lib/getPersonFromUser";
import prisma from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Person } from "@prisma/client";

export const checkIfNewUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    return { isNewUser: false };
  }

  const person = await getPersonFromUser(userId);

  console.log("Person:", person);

  if (!person) {
    return { isNewUser: false };
  }

  const isNewUser =
    !person.phone_number ||
    !person.bu_id ||
    !person.college ||
    !person.dietary_restrictions ||
    !person.class;

  return { isNewUser };
};

export const getUserDetails = async (): Promise<Person | undefined> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await getPersonFromUser(userId);
  if (!person) {
    throw new Error("User not found");
  }

  return person;
};

export const updateUserDetails = async (details: {
  phone_number: string;
  bu_id: string;
  college: string;
  class: number;
  dietary_restrictions: string;
}) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await getPersonFromUser(userId);
  if (!person) {
    throw new Error("User not found");
  }

  const updatedPerson = await prisma.person.update({
    where: { id: person.id },
    data: {
      phone_number: details.phone_number,
      bu_id: details.bu_id,
      college: details.college,
      class: details.class,
      dietary_restrictions: details.dietary_restrictions,
    },
  });

  console.log("Updated person:", updatedPerson);

  return updatedPerson;
};
