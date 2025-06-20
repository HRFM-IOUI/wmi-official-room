import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Firebaseの初期化
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string) as ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app(); // すでに初期化されている場合は再初期化しない
}

export { admin };
