"use server";

import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { Person } from "@prisma/client";

export const checkIfNewUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return { isNewUser: false };
  }

  const user = await prisma.person.findUnique({
    where: { email: session.user.email },
  });

  console.log("User:", user);

  if (!user) {
    return { isNewUser: false };
  }

  const isNewUser =
    !user.phone_number ||
    !user.bu_id ||
    !user.college ||
    !user.dietary_restrictions ||
    !user.class;

  return { isNewUser };
};

export const getUserDetails = async (): Promise<Person | undefined> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Not authenticated");
  }

  const user: Person | null = await prisma.person.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    console.error("user not found");
    return;
  }

  return user;
};

export const updateUserDetails = async (details: {
  phone_number: string;
  bu_id: string;
  college: string;
  dietary_restrictions: string;
  class: number;
}) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Not authenticated");
  }

  console.log("Updating user details:", details);

  const user = await prisma.person.update({
    where: { email: session.user.email },
    data: {
      phone_number: details.phone_number,
      bu_id: details.bu_id,
      college: details.college,
      dietary_restrictions: details.dietary_restrictions,
      class: details.class,
    },
  });

  console.log("Updated user:", user);

  return user;
};
