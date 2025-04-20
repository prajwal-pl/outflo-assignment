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

    // Return empty array instead of 404 when no campaigns are found
    // This allows the client to properly show the empty state UI
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
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCampaign: RequestHandler = async (req, res) => {
  const { name, description, status, leads, accountIDs } = req.body;
  try {
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        status,
        leads,
        accountIDs,
      },
    });

    if (!campaign) {
      res.status(400).json({ error: "Failed to create campaign" });
      return;
    }

    res.status(201).json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCampaign: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name, description, status, leads, accountIDs } = req.body;
  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        status,
        leads,
        accountIDs,
      },
    });

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }
    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCampaign: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: { status: "DELETED" }, // Assuming you want to set the status to DELETED instead of actually deleting it
    });

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
