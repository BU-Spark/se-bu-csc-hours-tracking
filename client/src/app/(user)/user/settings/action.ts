"use server";

import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

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

<<<<<<< HEAD:client/src/app/(user)/user/settings/action.ts
  const isNewUser =
    !user.phone_number ||
    !user.college ||
    !user.dietary_restrictions ||
    !user.class;
=======
<<<<<<< Updated upstream:client/src/app/settings/action.ts
  const isNewUser = !user.phone_number || !user.college || !user.dietary_restrictions;
=======
  const isNewUser =
    !user.phone_number ||
    !user.bu_id ||
    !user.college ||
    !user.dietary_restrictions ||
    !user.class;
>>>>>>> Stashed changes:client/src/app/(user)/user/settings/action.ts
>>>>>>> settings:client/src/app/settings/action.ts

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

<<<<<<< HEAD:client/src/app/(user)/user/settings/action.ts
export const updateUserDetails = async (details: {
  phone_number: string;
=======
<<<<<<< Updated upstream:client/src/app/settings/action.ts
export const updateUserDetails = async (details: { phone_number: string, college: string, dietary_restrictions: string }) => {
=======
export const updateUserDetails = async (details: {
  phone_number: string;
  bu_id: string;
>>>>>>> settings:client/src/app/settings/action.ts
  college: string;
  dietary_restrictions: string;
  class: number;
}) => {
<<<<<<< HEAD:client/src/app/(user)/user/settings/action.ts
=======
>>>>>>> Stashed changes:client/src/app/(user)/user/settings/action.ts
>>>>>>> settings:client/src/app/settings/action.ts
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
