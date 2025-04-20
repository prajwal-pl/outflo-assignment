import express from "express";
import {
  createCampaign,
  deleteCampaign,
  fetchAllCampaigns,
  fetchSingleCampaign,
  updateCampaign,
} from "../controllers/campaign.controller";

const router = express.Router();

router.get("/", fetchAllCampaigns);
router.get("/:id", fetchSingleCampaign);
router.post("/", createCampaign);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;
