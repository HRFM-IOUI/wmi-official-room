import * as admin from 'firebase-admin'; // firebase-adminのインポート
import { ServiceAccount } from 'firebase-admin';

// Firebaseの初期化
if (!admin.apps.length) {
  const serviceAccount = require("../serviceAccountKey.json") as ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app(); // すでに初期化されている場合は再初期化しない
}

export { admin };
