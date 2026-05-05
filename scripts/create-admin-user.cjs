// Script to create/update the admin Firebase Auth user
const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = require('C:\\Users\\uwaba\\Downloads\\nikuzeportfolio-firebase-adminsdk-fbsvc-c832697379.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const EMAIL = 'nikuzejos85@gmail.com';
const PASSWORD = 'Cadette25';

async function run() {
  try {
    // Try to create user first
    const user = await admin.auth().createUser({ email: EMAIL, password: PASSWORD, emailVerified: true });
    console.log('✅ Admin user created:', user.uid);
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      // User exists — just update the password
      const existing = await admin.auth().getUserByEmail(EMAIL);
      await admin.auth().updateUser(existing.uid, { password: PASSWORD, emailVerified: true });
      console.log('✅ Admin user password updated for:', EMAIL);
    } else {
      console.error('❌ Error:', err.message);
    }
  }
  process.exit(0);
}

run();
