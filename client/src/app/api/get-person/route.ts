import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clerk_id = searchParams.get('clerk_id');
  console.log('GET /api/get-person - Received request with clerk_id:', clerk_id);

  if (!clerk_id) {
    console.log('GET /api/get-person - Missing clerk_id parameter');
    return NextResponse.json(
      { error: 'clerk_id is required', person: null },
      { status: 400 }
    );
  }

  try {
    console.log('GET /api/get-person - Searching for person with clerk_id:', clerk_id);
    const person = await prisma.person.findUnique({
      where: { clerk_id },
    });

    if (person) {
      console.log('GET /api/get-person - Found person:', person);
      return NextResponse.json({ person, error: null });
    } else {
      console.log('GET /api/get-person - Person not found for clerk_id:', clerk_id);
      return NextResponse.json(
        { error: 'Person not found', person: null },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('GET /api/get-person - Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error', person: null },
      { status: 500 }
    );
  }
}