import express from "express";
import {
  createCampaign,
  fetchAllCampaigns,
  fetchSingleCampaign,
} from "../controllers/campaign.controller";

const router = express.Router();

router.get("/", fetchAllCampaigns);
router.get(":/id", fetchSingleCampaign);
router.post("/", createCampaign);

export default router;
