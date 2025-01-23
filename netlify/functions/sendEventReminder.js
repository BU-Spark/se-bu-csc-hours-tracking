//emails sent every hour for events within 23-24 hours from then
//Google workplace accs restricted to 2000 emails/day?

const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an OAuth2 client with credentials from environment variables
const createOAuth2Client = () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return oauth2Client;
};

// Function to send an email
const sendEmail = async (gmailClient, to, subject, message) => {

  // Construct the raw email
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    '',
    message,
  ];
  const rawMessage = emailLines.join('\r\n');

  // Gmail API requires base64-encoded message
  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Gmail API uses URL-safe base64 encoding

  // Send the email using Gmail API
  const res = await gmailClient.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return res.data; // Return response for debugging/logging
};


// Netlify Function handler
exports.handler = async (event) => {
  const now = new Date();
  const in23Hours = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23 hours from now
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
  const isPreview = event.queryStringParameters && event.queryStringParameters.preview === 'true';
  try {
    const applications = await prisma.application.findMany({
      where: {
        approval_status: 1, // Only approved applications
        event: {
          event_start: {
            gte: in23Hours, // Start time is at least 23 hours from now
            lte: in24Hours, // Start time is at most 24 hours from now
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
            event_end: true,
          },
        },
      },
    });

    if (isPreview) {
      // Build an array of email details with HTML content to return in the response for preview
      const emailDetails = applications.map((app) => {
        const { email, name } = app.applicant;
        const { title, event_start, event_end } = app.event;

        return {
          to: email,
          eventTitle: title,
          eventStart: event_start.toLocaleString(), // Convert to a readable format if needed
          eventEnd: event_end.toLocaleString(),
        };
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Preview generated successfully',
          emailDetails: emailDetails,
        }),
      };
    }

    const oauth2Client = createOAuth2Client();
    const gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });

    // Send actual emails
    for (const app of applications) {
      const { email, name } = app.applicant;
      const { title, event_start, event_end } = app.event;
      const subject = `Reminder: ${title} is Coming Up!`;
      const body = `
          <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
          <html>

          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title>Boston University</title>
            <meta name="HandheldFriendly" content="True" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style type="text/css" media="screen">
              body {
                background-color: #f6f7f7;
                margin: 0;
                padding: 0;
              }

              img {
                display: block;
                border: 0;
              }

              .yshortcuts,
              .yshortcuts a,
              .yshortcuts a:link,
              .yshortcuts a:visited,
              .yshortcuts a:hover {
                border: none;
                background: none;
              }

              h1 {
                color: #000000 !important;
              }

              h2,
              h3,
              h4,
              h5,
              h6,
              .email-body h1 {
                color: #000000 !important;
              }

              @media screen and (max-device-width: 500px),
              screen and (max-width: 500px) {
                body .content {
                  width: 95% !important;
                }

                body .email-heading {
                  font-size: .8em !important;
                }

                body .email-header-image img {
                  width: 100% !important;
                }

                body .email-body {
                  font-size: 1em !important;
                  line-height: 1.6em !important;
                }

                body .email-body p {
                  font-size: .9em !important;
                  line-height: 1.5em !important;
                }

                body .email-footer {
                  font-size: .8em !important;
                  line-height: 1.2em !important;
                }

                body .footer img {
                  width: 80px !important;
                  padding-left: 10px;
                }

                body table.content td.email-body {
                  width: 200px !important;
                  padding: 0px 10px;
                }

              }

              @media only screen and (max-device-width: 480px) {

                a[href^="tel"],
                a[href^="sms"] {
                  text-decoration: none;
                  color: #cc0000;
                  pointer-events: none;
                  cursor: default;
                }

                .mobile_link a[href^="tel"],
                .mobile_link a[href^="sms"] {
                  text-decoration: default;
                  color: #cc0000 !important;
                  pointer-events: auto;
                  cursor: default;
                }

                img {
                  width: 100%;
                  height: auto;
                }
              }

              @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {

                a[href^="tel"],
                a[href^="sms"] {
                  text-decoration: none;
                  color: #cc0000;
                  pointer-events: none;
                  cursor: default;
                }

                .mobile_link a[href^="tel"],
                .mobile_link a[href^="sms"] {
                  text-decoration: default;
                  color: #cc0000 !important;
                  pointer-events: auto;
                  cursor: default;
                }
              }
            </style>
          </head>

          <body style="background-color: #f6f7f7; margin: 0; padding: 0;">
            <table class="optionTemplate" data-option-id="1" bgcolor="#f6f7f7" border="0" cellpadding="0" cellspacing="0"
              width="100%" class="wrapper">
              <tbody>
                <tr>
                  <td bgcolor="#f6f7f7">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="500" class="content">
                      <tbody>
                        <tr>
                          <td height="25"> </td>
                        </tr>
                        <tr>
                          <td style="background-color:#F6F7F7;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="500" class="content">
                              <tbody>

                                <tr>

                                  <td style="line-height: 18px;">
                                    <h1
                                      style="color: #000000; font-weight: bold; font-size: 15px; font-family: arial, sans-serif; mso-line-height-rule:exactly; line-height: 18px; margin: 0;"
                                      class="email-heading"><!--{{header|safe}}--> Boston University Community Service Center</h1>
                                  </td>

                                  <td width="38"><img src="http://www.bu.edu/marcom/html-emails/images/mc_bu_logo_sm.gif"> </td>

                                </tr>
                                <tr>

                                  <td height="25"> </td>
                                  <td height="25"> </td>

                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td bgcolor="#FFFFFF">
                            <table align="center" border="0" cellpadding="0" cellspacing="12" width="460" class="content">
                              <tbody>
                                <tr>
                                  <td style="font-size: 13px; font-family: arial, sans-serif; line-height: 21px; color: #333333;"
                                    class="email-body"><!--{{body|safe}}-->
                                    <h2>Reminder: Your event is coming up!</h2>
                                    <p>Hi ${name},</p>
                                    <p>This is a reminder that you are approved for the event <strong>${title}</strong>, which starts tomorrow.</p>
                                    <p><strong>Event Start Time:</strong> ${event_start.toLocaleString()}</p>
                                    <p>Please make sure you're ready to participate!</p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td bgcolor="#FFFFFF" height="20"> </td>
                        </tr>
                        <tr>
                          <td bgcolor="#eceded" height="1" width="100%"> </td>
                        </tr>
                        <tr>
                          <td height="30"> </td>
                        </tr>
                        <tr>
                          <td>
                            <table class="footer" border="0" cellspacing="0" cellpadding="0">
                              <tbody>
                                <tr>
                                  <td width="355" valign="top"
                                    style="font-size: 12px; font-family: arial, sans-serif; line-height: 17px; color: #595959; padding-left:20px;"
                                    class="email-footer"><!--{{footer|safe}}-->
                                    <p>
                                      <strong>Boston University</strong> Community Service Center<br />
                                      George Sherman Union, 4th Floor<br />
                                      775 Commonwealth Avenue<br />
                                      Boston, MA 02215<br />
                                      Hours: 9:00 am to 5:00 pm + Events<br />
                                      (t) 617-353-4710 | (f) 617-353-9424<br />
                                      <a style="color: #cc0000;" href="https://www.bu.edu/csc/">bu.edu/csc</a>
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td height="60"> </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>

          </html>
        `;

      try {
        const result = await sendEmail(gmailClient, email, subject, body);
        console.log(`Email sent to: ${email}`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Email sent successfully!', data: result }),
        };
      } catch (err) {
        console.error(`Failed to send email to ${app.applicant.email}:`, err.message);
      }
    }

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email', details: error.message }),
    };
  } finally {
    await prisma.$disconnect();
  }

};
