// Campaign related types
export enum CampaignStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[]; // LinkedIn URLs
  accountIDs: string[]; // MongoDB ObjectIDs
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: string[];
}

export interface UpdateCampaignPayload extends Partial<CreateCampaignPayload> {
  id: string;
}

// LinkedIn Profile related types
export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  summary?: string;
  occupation?: string;
  company?: string;
  location?: string;
  profileUrl: string;
}

export interface PersonalizedMessageResponse {
  message: string;
}
