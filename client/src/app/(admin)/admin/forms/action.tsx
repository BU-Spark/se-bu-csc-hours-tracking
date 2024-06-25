"use server";
import prisma from "@/lib/prisma";

export const deleteForm = async (formId: number) => {
  try {
    const response = await prisma.form.delete({ where: { id: formId } });

    if (!response) {
      console.error("bad response");
      return;
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};
