"use server";
import { CreateFormResponse, NewForm } from "@/interfaces/interfaces";
import prisma from "@/lib/prisma";

export const createForm = async (
  form: NewForm
): Promise<CreateFormResponse | undefined> => {
  try {
    const newFormCode = await prisma.formCode.create({
      data: {
        title: form.title,
        description: form.description,
        downloadable: true,
        upload_link: form.uploadLink,
      },
    });

    if (!newFormCode) {
      console.error("error making new form code");
      return;
    }

    const newForm = await prisma.form.create({
      data: {
        file: `REDIRECT-${form.fileLink}`,
        type: newFormCode.id,
      },
    });

    if (!newForm) {
      console.error("error making new form");
      return;
    }

    return { newForm, newFormCode };
  } catch (error) {
    console.error(error);
  }
};
