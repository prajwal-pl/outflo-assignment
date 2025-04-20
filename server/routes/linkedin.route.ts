import express from "express";
import { generatePersonalizedMessage } from "../controllers/linkedin.controller";

const router = express.Router();

router.post("/", generatePersonalizedMessage);

export default router;
