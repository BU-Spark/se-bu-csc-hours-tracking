import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clerk_id = searchParams.get('clerk_id');

  if (!clerk_id) {
    return NextResponse.json(
      { error: 'clerk_id is required', person: null },
      { status: 400 }
    );
  }

  try {
    const person = await prisma.person.findUnique({
      where: { clerk_id },
    });

    if (person) {
      return NextResponse.json({ person, error: null });
    } else {
      return NextResponse.json(
        { error: 'Person not found', person: null },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', person: null },
      { status: 500 }
    );
  }
}