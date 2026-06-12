import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized", person: null },
      { status: 401 }
    );
  }

  try {
    const person = await prisma.person.findUnique({
      where: { clerk_id: userId },
    });

    if (person) {
      return NextResponse.json({ person, error: null });
    }

    return NextResponse.json(
      { error: "Person not found", person: null },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", person: null },
      { status: 500 }
    );
  }
}
