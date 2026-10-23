import "@/backend/lib/envFile.js";
import { failure, Result, success } from "@/common/types.js";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import { z } from "zod";

const serviceAccountSchema = z.object({
  type: z.string(),
  project_id: z.string(),
  private_key_id: z.string(),
  private_key: z.string().transform((key) => atob(key)),
  client_email: z.string(),
  client_id: z.string(),
  auth_uri: z.string(),
  token_uri: z.string(),
  auth_provider_x509_cert_url: z.string(),
  client_x509_cert_url: z.string(),
});

const result = serviceAccountSchema.safeParse({
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
});

let serviceAccount: z.infer<typeof serviceAccountSchema> | null = null;
if (result.success) {
  serviceAccount = result.data;
}

let firebaseAppInitialized = false;
export const initializeFirebaseApp = () => {
  if (firebaseAppInitialized) {
    return;
  }
  if (!serviceAccount) {
    console.log(
      "Could not initialize Firebase app due to missing env vars:",
      result,
    );
  } else {
    initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
  firebaseAppInitialized = true;
};

// decodedToken includes email, user_id, and other fields
export const verifyIdToken = async (
  idToken: string,
): Promise<Result<DecodedIdToken>> => {
  initializeFirebaseApp();
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return success(decodedToken);
  } catch (error) {
    console.error(error);
    return failure(JSON.stringify(error));
  }
};
