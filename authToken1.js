const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);


const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline', // Required to get a refresh token
  scope: ['https://www.googleapis.com/auth/gmail.send'], // Scope for sending emails
  prompt: 'consent', // Forces re-consent to issue a refresh token
});

console.log('Authorize this app by visiting this URL:', authUrl);
