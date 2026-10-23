import { PAGESDIR } from "@/backend/lib/config.js";
import { NextFunction, Request, Response, Router } from "express";
import path from "path";
import { getUser } from "@/backend/lib/middleware/auth.js";

const entrypointsRouter = Router();

export const redirectIfAlreadyLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await getUser(req.cookies.token);
  if (user) {
    res.redirect(`/`);
    return;
  }
  next();
};

type Alias = {
  file: string;
  middleware?: any[];
};

const aliases = {
  "/": {
    file: "index.html",
  },
  "/signin": {
    file: "signin.html",
    middleware: [redirectIfAlreadyLoggedIn],
  },
  "/signup": {
    file: "signup.html",
    middleware: [redirectIfAlreadyLoggedIn],
  },
  "/moods": {
    file: "moods/index.html",
    //middleware: [isLoggedIn],
  },
  "/moods/new": {
    file: "moods/new.html",
    //middleware: [isLoggedIn],
  },
  "/moods/:id": {
    file: "moods/show.html",
    //middleware: [isLoggedIn],
  },
  "/moods/:id/edit": {
    file: "moods/edit.html",
    //middleware: [isLoggedIn],
  },
};

Object.entries(aliases).forEach(([alias, entrypoint]: [string, Alias]) => {
  entrypointsRouter.get(alias, ...(entrypoint.middleware || []), (req, res) =>
    res.sendFile(path.join(PAGESDIR, entrypoint.file)),
  );
});

export default entrypointsRouter;
