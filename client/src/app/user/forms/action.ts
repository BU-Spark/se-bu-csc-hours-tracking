"use server";
import prisma from "../../utils/prisma";
import { Form, Code } from "@/interfaces/interfaces";

export async function getForms(): Promise<Form[]> {
  try {
    const forms: Form[] = await prisma.form.findMany();
    return forms;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCodes(): Promise<Code[]> {
  try {
    const codes: Code[] = await prisma.formCode.findMany();
    return codes;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createDummyForms(): Promise<any> {
  try {
    const currentForms = await prisma.form.findMany();
    if (currentForms.length > 0) return;

    const newFormCodes = await prisma.formCode.createMany({
      data: [
        {
          title: "CORI Form",
          description: "Criminal Background check release form",
          downloadable: true,
          upload_link: "https://www.bu.edu/csc/protection-of-minors/",
        },
        {
          title: "Dummy Form",
          description: "This is a fake form",
          downloadable: true,
          upload_link: "https://www.bu.edu/csc/protection-of-minors/",
        },
      ],
    });
    const newForms = await prisma.form.createMany({
      data: [
        {
          file: "/example_CORI.pdf",
          type: 1,
        },
        { file: "./example_CORI.pdf", type: 2 },
        { file: "./example_CORI.pdf", type: 2 },
        { file: "./example_CORI.pdf", type: 2 },
      ],
    });

    if (newFormCodes && newForms) {
      console.log(newForms, newFormCodes);
      return { newForms, newFormCodes };
    }
  } catch (error) {
    console.error(error);
  }
}