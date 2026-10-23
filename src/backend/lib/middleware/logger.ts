import { NextFunction, Request, Response } from "express";
import { color } from "termcolors";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - start;
    console.log(
      color.yellow(req.method),
      color.magenta(req.url),
      "->",
      res.statusCode < 400
        ? color.green(res.statusCode)
        : color.red(res.statusCode),
      `${responseTime}ms`,
    );
  });

  next();
};

export default loggerMiddleware;
