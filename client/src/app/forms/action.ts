"use server";
import prisma from "../utils/prisma";
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
    const codes = await prisma.formCode.findMany();
    return codes;
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
