import * as z from "zod";
import { db } from "../../db";
import { WithId } from "mongodb";

export const Token = z.object({
  card_number: z
    .number()
    .gte(1000000000000, {
      message: "Card number length must be greater or equal than 13",
    })
    .lte(9999999999999999, {
      message: "Card number length must be lower or equal than 16",
    }),
  cvv: z
    .number()
    .gte(100, { message: "CVV length must be greater or equal than 3" })
    .lte(9999, { message: "CVV length must be greater or equal than 4" }),
  expiration_month: z
    .preprocess(
      (a) => parseInt(a as string, 10),
      z
        .number()
        .positive()
        .min(1, { message: "Expiration month must be between 1 and 12" })
        .max(12, { message: "Expiration month must be between 1 and 12" })
    )
    .transform((a) => a.toString()),
  expiration_year: z
    .preprocess(
      (a) => parseInt(a as string, 10),
      z
        .number()
        .positive()
        .refine(async (e) => {
          const year = new Date().getFullYear();
          return e - year <= 5 && e - year >= 0;
        }, "Expiration year must be lower or equal than 5 years")
    )
    .transform((a) => a.toString()),
  email: z
    .string()
    .email("This is not a valid email")
    .refine(async (e) => {
      return (
        e.endsWith("gmail.com") ||
        e.endsWith("hotmail.com") ||
        e.endsWith("yahoo.es")
      );
    }, "This email is not in our database"),
});

export type Token = z.infer<typeof Token>;
export type TokenWithId = WithId<Token>;
export const Tokens = db.collection<Token>("tokens");
