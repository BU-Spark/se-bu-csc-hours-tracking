"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const checkIfNewUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return { isNewUser: false };
  }

  const user = await prisma.person.findUnique({
    where: { email: session.user.email },
  });

  console.log('User:', user);

  if (!user) {
    return { isNewUser: false };
  }

  const isNewUser = !user.phone_number || !user.college || !user.dietary_restrictions;

  return { isNewUser };
};

export const getUserDetails = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.person.findUnique({
    where: { email: session.user.email },
  });

  return user;
};

export const updateUserDetails = async (details: { phone_number: string, college: string, dietary_restrictions: string }) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Not authenticated");
  }

  console.log('Updating user details:', details);

  const user = await prisma.person.update({
    where: { email: session.user.email },
    data: {
      phone_number: details.phone_number,
      college: details.college,
      dietary_restrictions: details.dietary_restrictions,
    },
  });

  console.log('Updated user:', user);

  return user;
};