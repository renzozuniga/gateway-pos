import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import tokens from "./tokens/tokens.routes";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/tokens", tokens);

export default router;
