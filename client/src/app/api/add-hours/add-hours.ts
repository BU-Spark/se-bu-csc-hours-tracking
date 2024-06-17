import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { event, hours, feedback, description, editorId } = req.body;
    const session = await getSession({ req });

    if (!session?.user?.email) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const user = await prisma.person.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const eventData = await prisma.event.findFirst({
        where: { title: event },
      });

      if (!eventData) {
        res.status(404).json({ error: "Event not found" });
        return;
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
          updated_by_id: editorId,
          updated_at: new Date(),
          deleted_by_id: undefined,
          deleted_at: undefined,
          updated_by: {
            connect: { id: editorId },
          },
        },
      });

      res.status(201).json(newHourSubmission);
    } catch (error) {
      console.error("Error adding hours:", error);
      res.status(500).json({ error: "Error adding hours" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}