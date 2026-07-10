const fs = require('fs');
const b64 = fs.readFileSync('tech-club-538d6-firebase-adminsdk-fbsvc-120c84e89f.json').toString('base64');
let env = fs.readFileSync('.env', 'utf-8');
env = env.replace(/^GOOGLE_APPLICATION_CREDENTIALS=.*$/m, '');
env += `\nFIREBASE_SERVICE_ACCOUNT_BASE64="${b64}"\n`;
fs.writeFileSync('.env', env);
console.log('Successfully updated .env with base64 encoded JSON');
console.log('Base64 string to copy to Netlify (FIREBASE_SERVICE_ACCOUNT_BASE64):');
console.log(b64);
