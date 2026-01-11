import { Request, Response, NextFunction } from "express";
import { verifyIdToken } from "@/backend/lib/firebase.js";
import { DecodedIdToken } from "firebase-admin/auth";
import { findUserByEmail } from "@/backend/db/user.js";

export const getUser = async (
  token: string | undefined
): Promise<DecodedIdToken | null> => {
  if (!token) {
    return null;
  }
  const decodeResult = await verifyIdToken(token);
  if (!decodeResult.success) {
    return null;
  }
  return decodeResult.value;
};

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firebaseUser = await getUser(req.cookies.token);
  if (!firebaseUser) {
    res.status(401).redirect(`/signin?redirect=${req.originalUrl}`);
    return;
  }

  const email = firebaseUser.email;
  if (!email) {
    res.status(401).json({ error: "Firebase user missing email" });
    return;
  }

  const dbUser = await findUserByEmail({ email });
  if (!dbUser.success) {
    res.status(500).json({ error: dbUser.error });
    return;
  }
  if (!dbUser.value) {
    res.status(401).json({ error: "User not found in database" });
    return;
  }

  if (!dbUser.value.approved) {
    res.status(403).json({
      error:
        "Your account has not been approved yet. Please contact an administrator.",
    });
    return;
  }

  res.locals.user = dbUser.value;
  res.locals.firebaseUser = firebaseUser;
  next();
};
