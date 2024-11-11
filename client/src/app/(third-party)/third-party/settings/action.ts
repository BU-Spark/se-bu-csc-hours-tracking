"use server";

import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { Organization, Person } from "@prisma/client";

export const checkIfNewUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return { isNewUser: false };
  }

  const user = await prisma.person.findUnique({
    where: { email: session.user.email },
  });

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

export const getOrganizationDetails = async (): Promise<Organization | undefined> => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Not authenticated");
  }

  const person = await prisma.person.findUnique({
    where: { email: session.user.email }, 
    select: { affiliation_id: true }, 
  });
  if (!person || !person.affiliation_id) {
    throw new Error("No affiliation found for the user");
  }
  const user: Organization | null = await prisma.organization.findUnique({
    where: { id: person.affiliation_id },
    //change the where statement to check the userid affiliate id is equal to the id of the organization
  });
  if (!user) {
    throw new Error("Organization not found for this affiliation ID");
  }

  if (!user) {
    console.error("user not found");
    return;
  }

  console.log(user.name);
  return user;
};

export const updateOrganizerDetails = async (details: {
  name?: string;
  nameofservice?: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: number;
  phone_number?: string;
  email: string;
  apt?: string;
  image?: Buffer | null;
}) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Not authenticated");
  }
  const person = await prisma.person.findUnique({
    where: { email: session.user.email }, 
    select: { affiliation_id: true }, 
  });
  if (!person || !person.affiliation_id) {
    throw new Error("No affiliation found for the user");
  }
  
  //change the where statement to check the userid affiliate id is equal to the id of the organization
  const user = await prisma.organization.update({
    where: { id: person.affiliation_id },
    data: {
      name: details.name,
      nameofservice: details.nameofservice,
      street: details.street,
      city: details.city,
      state: details.state,
      apt: details.apt,
      zipcode: details.zipcode,
      phone_number: details.phone_number,
      email: details.email,
      image: details.image
      
    },
  });

  console.log("Updated user:", user);

  return user;
};
