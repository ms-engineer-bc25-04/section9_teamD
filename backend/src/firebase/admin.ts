import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

const app = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY_JSON!)),
});

export const auth = getAuth(app);
