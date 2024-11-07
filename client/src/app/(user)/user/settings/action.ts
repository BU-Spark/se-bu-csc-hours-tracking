"use server";

import prisma from "../../../../lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
