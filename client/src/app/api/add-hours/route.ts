import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, hours, feedback, description } = body;
    const token = await getToken({ req });

    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = token.email;
    const user = await prisma.person.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the default category exists
    let defaultCategory = await prisma.category.findFirst({
      where: { name: 'Default Category' },
    });

    // If the default category does not exist, create it
    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: {
          name: 'Default Category',
        },
      });
    }

    // Check if the default organization exists
    let defaultOrganization = await prisma.organization.findFirst({
      where: { name: 'Default Organization' },
    });

    // If the default organization does not exist, create it
    if (!defaultOrganization) {
      defaultOrganization = await prisma.organization.create({
        data: {
          name: 'Default Organization',
          abbreviation: 'DO',
        },
      });
    }

    // Check if the event exists
    let eventData = await prisma.event.findUnique({
      where: { title: event },
    });

    // If event does not exist, create it
    if (!eventData) {
      eventData = await prisma.event.create({
        data: {
          title: event,
          event_start: new Date(), // Adjust as needed
          event_end: new Date(), // Adjust as needed
          reg_start: new Date(), // Adjust as needed
          reg_end: new Date(), // Adjust as needed
          estimated_participants: 0, // Adjust as needed
          location: 'Default Location', // Adjust as needed
          transit: 'Default Transit', // Adjust as needed
          description: 'Default Description', // Adjust as needed
          category_id: defaultCategory.id,
          coordinator_id: user.id,
          organization_id: defaultOrganization.id,
          image: Buffer.from(''), // Placeholder for image
        },
      });
    }

    const newHourSubmission = await prisma.hourSubmission.create({
      data: {
        hours: parseFloat(hours),
        note: feedback,
        description: description,
        event: {
          connect: { id: eventData.id },
        },
        volunteer: {
          connect: { id: user.id },
        },
        approval_status: 0,
        date_submitted: new Date(),
      },
    });

    return NextResponse.json(newHourSubmission, { status: 201 });
  } catch (error) {
    console.error('Error adding hours:', error);
    return NextResponse.json({ error: 'Error adding hours' }, { status: 500 });
  }
}
