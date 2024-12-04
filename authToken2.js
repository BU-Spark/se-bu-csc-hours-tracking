const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// Paste the authorization code here from redirect url of authToken1.js
const code = ''; 
// const decodedCode = decodeURIComponent(code);
async function getTokens() {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log('Access Token:', tokens.access_token);
  console.log('Refresh Token:', tokens.refresh_token);
}

getTokens();
