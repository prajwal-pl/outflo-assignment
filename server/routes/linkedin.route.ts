import express from "express";
import { generatePersonalizedMessage } from "../controllers/linkedin.controller.js";

const router = express.Router();

router.post("/", generatePersonalizedMessage);

export default router;
