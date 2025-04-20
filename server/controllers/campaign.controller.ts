import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

const prisma = new PrismaClient();

export const fetchAllCampaigns: RequestHandler = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: {
          in: ["ACTIVE", "INACTIVE"],
        },
      },
    });

    if (!campaigns || campaigns.length === 0) {
      res.status(404).json({ message: "No campaigns found" });
    }

    console.log(campaigns);

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchSingleCampaign: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCampaign: RequestHandler = async (req, res) => {};
