"use server";

import { getPersonFromUser } from "@/lib/getPersonFromUser";
import prisma from "../../../../lib/prisma";
import { auth } from '@clerk/nextjs/server'
import { Organization, Person } from "@prisma/client";

export const checkIfNewUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await getPersonFromUser(userId);

  if (!person || !person.email) {
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

export const getOrganizationDetails = async (): Promise<Organization | undefined> => {
  
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await getPersonFromUser(userId);

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
  image?: string;
}) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await getPersonFromUser(userId);
  
  if (!person || !person.affiliation_id) {
    throw new Error("No affiliation found for the user");
  }
  console.log('Image type:', typeof details.image);
  console.log('Image:', details.image);
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
      image: details.image ? Buffer.from(details.image, 'base64') : undefined,
      
    },
  });

  console.log("Updated user:", user);

  return user;
};
export const createFormDetails = async (details: {
  //This function should upload new forms when user adds new forms
  name: string;
  required: boolean;
  notes: string;
  file?: string;
}) => {
  //NEED TO UPDATE PRISMA SCHEMA TO HAVE ALL THE CORRECT FIELDS
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await getPersonFromUser(userId);
  
  if (!person || !person.affiliation_id) {
    throw new Error("No affiliation found for the user");
  }
  const user = await prisma.formCode.create({
    data: {
      title: details.name,
      description: details.notes,
    },
  });
}

export const updateFormDetails = async (details: {
  // This function should update any existing form data
  name: string;
  required: boolean;
  notes: string;
  file?: string;
}) => {
  //NEED TO UPDATE PRISMA SCHEMA TO HAVE ALL THE CORRECT FIELDS
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const person = await getPersonFromUser(userId);
  
  if (!person || !person.affiliation_id) {
    throw new Error("No affiliation found for the user");
  }
  const user = await prisma.formCode.update({
    where: { id: person.affiliation_id },
    data: {
      title: details.name,
      description: details.notes,
    },
  });
}

