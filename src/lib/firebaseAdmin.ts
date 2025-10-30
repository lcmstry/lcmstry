import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let firestoreAdmin: FirebaseFirestore.Firestore;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // 🧠 Hapus tanda kutip & ubah literal \n jadi newline
  let privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.replace(/\\n/g, '\n')
    .replace(/^"|"$/g, ''); // hapus kutip di awal & akhir

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin environment variables');
  }

  const app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

  firestoreAdmin = getFirestore(app);
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('🔥 Firebase Admin initialization failed:', error);
  firestoreAdmin = null as unknown as FirebaseFirestore.Firestore;
}

export { firestoreAdmin };
