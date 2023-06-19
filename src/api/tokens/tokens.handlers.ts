import { Response, Request, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { ParamsWithId } from "../../interfaces/ParamsWithId";
import { TokenWithId, Tokens, Token } from "./tokens.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const SECRET_KEY: Secret = "TOKEN-API-SECRET-KEY";

export async function createOne(
  req: Request<{}, TokenWithId, Token>,
  res: Response,
  next: NextFunction
) {
  try {
    const insertResult = await Tokens.insertOne(req.body);
    if (!insertResult.acknowledged) throw new Error("Error inserting token.");

    const token = jwt.sign(
      {
        _id: insertResult.insertedId,
        ...req.body,
      },
      SECRET_KEY,
      {
        expiresIn: 60,
      }
    );

    res.status(201);
    res.json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
}

export async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    const result = await Tokens.findOne(
      {
        _id: new ObjectId(decoded._id),
      },
      { projection: { cvv: 0 } }
    );
    if (!result) {
      res.status(404);
      throw new Error(`Token is not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}
