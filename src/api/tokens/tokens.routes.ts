import { Router } from "express";
import { validateRequest, verify } from "../../middlewares";
import * as TokenHandlers from "./tokens.handlers";
import { Token } from "./tokens.model";

const router = Router();

router.get("/", verify(), TokenHandlers.findOne);
router.post(
  "/",
  validateRequest({
    body: Token,
  }),
  TokenHandlers.createOne
);

export default router;
