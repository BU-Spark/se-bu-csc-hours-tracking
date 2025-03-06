import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { auth } from '@clerk/nextjs/server'
import { getPersonFromUser } from '@/lib/getPersonFromUser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, hours, feedback, description, editorId } = body;
    const { userId } = await auth()
    const person = await getPersonFromUser(userId as string);

    if (!person || !person.email) {
      console.error("Unauthorized: No token or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = person.email;
    const user = await prisma.person.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let eventData = await prisma.event.findUnique({
      where: { title: event },
      select: {
        id: true,
        title: true,
        event_start: true,
        event_end: true,
        reg_start: true,
        reg_end: true,
        estimated_participants: true,
        location: true,
        transit: true,
        description: true,
        category_id: true,
        coordinator_id: true,
        form_id: true,
        organization_id: true,
      },
    });

    if (!eventData) {
      console.error("Event not found");
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const newHourSubmission = await prisma.hourSubmission.create({
      data: {
        hours: parseFloat(hours),
        feedback: feedback,
        description: description,
        event: {
          connect: { id: eventData.id },
        },
        volunteer: {
          connect: { id: user.id },
        },
        approval_status: 0,
        date_submitted: new Date(),
        updated_by_id: editorId,
        updated_at: new Date(),
        deleted_by_id: undefined,
        deleted_at: undefined,
        updated_by: {
          connect: { id: editorId },
        },
      },
    });

    return NextResponse.json(newHourSubmission, { status: 201 });
  } catch (error) {
    console.error('Error adding hours:', error);
    return NextResponse.json({ error: 'Error adding hours' }, { status: 500 });
  }
}
