// // netlify/functions/sendEventReminder.js
// const nodemailer = require('nodemailer');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,  // Use environment variable for email
//     pass: process.env.GMAIL_PASS,  // Use environment variable for app password
//   },
// });

// exports.handler = async (event, context) => {
//   const hours = 24; // For example, to get events within the next 24 hours

//   try {
//     // Fetch approved applications for events starting within the specified `hours`
//     const applications = await prisma.application.findMany({
//       where: {
//         approval_status: 1, // Only approved applications
//         event: {
//           event_start: {
//             gte: new Date(), // Ensure the event start is after the current time
//             lte: new Date(new Date().getTime() + hours * 60 * 60 * 1000), // Within the next `hours` hours
//           },
//         },
//       },
//       select: {
//         applicant: {
//           select: {
//             email: true, // Get the email of the applicant
//             name: true,  // Get the name of the applicant
//           },
//         },
//         event: {
//           select: {
//             title: true, // Get the event title
//             event_start: true, // Get the event start date
//           },
//         },
//       },
//     });

//     // Loop through each application and send an email reminder
//     for (const app of applications) {
//       const { email, name } = app.applicant;
//       const { title, event_start } = app.event;

//       const mailOptions = {
//         from: process.env.GMAIL_USER,  // Use environment variable for the sender email
//         to: email,
//         subject: `Reminder: ${title} is Coming Up!`,
//         text: `Hi ${name},\n\nThis is a reminder that you are approved for the event "${title}" which will start on ${event_start.toLocaleString()}.\n\nPlease make sure you're ready to participate!\n\nBest regards,\nYour Event Team`,
//       };

//       // Send the email
//       await transporter.sendMail(mailOptions);
//       console.log(`Email sent to: ${email}`);
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'Reminders sent successfully' }),
//     };
//   } catch (error) {
//     console.error('Error sending emails:', error);

//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Failed to send reminders' }),
//     };
//   }
// };


// netlify/functions/sendEventReminder.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  const hours = 24; // For example, to get events within the next 24 hours

  try {
    // Fetch approved applications for events starting within the specified `hours`
    const applications = await prisma.application.findMany({
      where: {
        approval_status: 1, // Only approved applications
        event: {
          event_start: {
            gte: new Date(), // Ensure the event start is after the current time
            lte: new Date(new Date().getTime() + hours * 60 * 60 * 1000), // Within the next `hours` hours
          },
        },
      },
      select: {
        applicant: {
          select: {
            email: true, // Get the email of the applicant
            name: true,  // Get the name of the applicant
          },
        },
        event: {
          select: {
            title: true, // Get the event title
            event_start: true, // Get the event start date
          },
        },
      },
    });

    // Build an array of email details to return in the response
    const emailDetails = applications.map((app) => {
      const { email, name } = app.applicant;
      const { title, event_start } = app.event;

      return {
        to: email,
        subject: `Reminder: ${title} is Coming Up!`,
        text: `Hi ${name},\n\nThis is a reminder that you are approved for the event "${title}" which will start on ${event_start.toLocaleString()}.\n\nPlease make sure you're ready to participate!\n\nBest regards,\nYour Event Team`,
      };
    });

    // Return the email details as part of the HTTP response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Preview generated successfully',
        emailDetails: emailDetails, // Send email details in the response
      }),
    };
  } catch (error) {
    console.error('Error generating preview:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate preview' }),
    };
  }
};
