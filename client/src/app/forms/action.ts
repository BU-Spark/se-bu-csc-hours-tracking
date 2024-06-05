"use server";
import prisma from "../utils/prisma";

export async function send() {
  try {
    const forms = await prisma.form.findMany();
    console.log(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
