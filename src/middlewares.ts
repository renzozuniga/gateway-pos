import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

import ErrorResponse from "./interfaces/ErrorResponse";
import RequestValidators from "./interfaces/RequestValidators";

export const SECRET_KEY: Secret = "TOKEN-API-SECRET-KEY";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export function verify() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new Error();
      }
      const decoded = jwt.verify(token, SECRET_KEY);

      (req as CustomRequest).token = decoded;

      next();
    } catch (error) {
      res.status(401).send("Token expired! Please create another token again, thanks.");
    }
  };
}

export function validateRequest(validators: RequestValidators) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).send(error);
      }
      next(error);
    }
  }
}

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
