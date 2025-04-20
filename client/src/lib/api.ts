import {
  Campaign,
  CreateCampaignPayload,
  PersonalizedMessageResponse,
  UpdateCampaignPayload,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL!;

// API client for campaigns
export const campaignApi = {
  fetchAll: async (): Promise<Campaign[]> => {
    const response = await fetch(`${API_BASE_URL}/campaigns`);
    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }
    return response.json();
  },

  fetch: async (id: string): Promise<Campaign> => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch campaign with id: ${id}`);
    }
    return response.json();
  },

  create: async (campaign: CreateCampaignPayload): Promise<Campaign> => {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaign),
    });
    if (!response.ok) {
      throw new Error("Failed to create campaign");
    }
    return response.json();
  },

  update: async (campaign: UpdateCampaignPayload): Promise<Campaign> => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaign.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaign),
    });
    if (!response.ok) {
      throw new Error(`Failed to update campaign with id: ${campaign.id}`);
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete campaign with id: ${id}`);
    }
  },
};

// API client for LinkedIn services
export const linkedinApi = {
  generatePersonalizedMessage: async (
    url: string
  ): Promise<PersonalizedMessageResponse> => {
    const response = await fetch(`${API_BASE_URL}/personalized-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error("Failed to generate personalized message");
    }
    return response.json();
  },
};
