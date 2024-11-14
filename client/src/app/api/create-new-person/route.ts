import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    console.log('POST /api/create-new-person: Starting request');
    const { userId } = await auth();

    if (!userId) {
      console.log('POST /api/create-new-person: Unauthorized - No user ID');
      return NextResponse.json(
        { message: 'Unauthorized: No user ID found.' },
        { status: 401 }
      );
    }

    const { email } = await request.json();
    console.log('POST /api/create-new-person: Received email:', email);

    if (!email) {
      console.log('POST /api/create-new-person: Missing email in request');
      return NextResponse.json(
        { message: 'Bad Request: Email is required.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.person.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.clerk_id) {
      console.log('POST /api/create-new-person: User already exists and has a clerk ID:', email);
      return NextResponse.json({ message: 'User already exists and has a clerk ID.' });
    }
    
    const role = email.endsWith('@bu.edu') ? 'USER' : 'ORGANIZER';
    console.log('POST /api/create-new-person: Assigning role:', role);

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
    console.log('POST /api/create-new-person: User created / updated successfully:', newUser);

    return NextResponse.json({ message: 'User entry created successfully.' });
  } catch (error) {
    console.error('POST /api/create-new-person: Error occurred:', error);
    return NextResponse.json(
      { message: 'Internal Server Error: Unable to create user.' },
      { status: 500 }
    );
  }
}