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

  // Fetch the user's email from Clerk
  const user = await fetchUserFromClerk(userId);

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    return { isNewUser: false };
  }

  // Fetch the Person record from your database
  const person = await prisma.person.findUnique({
    where: { email },
  });

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

// Helper function to fetch user data from Clerk
async function fetchUserFromClerk(userId: string) {
  const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user from Clerk");
  }

  const user = await response.json();
  return user;
}

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
