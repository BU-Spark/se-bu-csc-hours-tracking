"use server";
import prisma from "../utils/prisma";

interface Form {
  id: number;
  type: number;
  file: String;
  student_id: number | null;
}
interface Code {
  id: number;
  title: String;
  description: String;
}

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
