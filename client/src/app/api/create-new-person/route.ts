import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized: No user ID found.' },
        { status: 401 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Bad Request: Email is required.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.person.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.clerk_id) {
      return NextResponse.json({ message: 'User already exists and has a clerk ID.' });
    }
    
    const role = email.endsWith('@bu.edu') ? 'USER' : 'ORGANIZER';

    const newUser = existingUser
      ? await prisma.person.update({
          where: { email },
          data: { clerk_id: userId },
        })
      : await prisma.person.create({
          data: {
            email,
            name: 'Please Update Your Name',
            role,
            clerk_id: userId,
          },
        });

    return NextResponse.json({ message: 'User entry created successfully.' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error: Unable to create user.' },
      { status: 500 }
    );
  }
}