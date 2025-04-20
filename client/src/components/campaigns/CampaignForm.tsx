import { useState } from "react";
import {
  Campaign,
  CampaignStatus,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from "../../lib/types";
import { campaignApi } from "../../lib/api";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CampaignFormProps {
  initialCampaign?: Campaign;
  onSuccess: (campaign: Campaign) => void;
  onCancel: () => void;
}

export function CampaignForm({
  initialCampaign,
  onSuccess,
  onCancel,
}: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state with default values or initial campaign values
  const [name, setName] = useState(initialCampaign?.name || "");
  const [description, setDescription] = useState(
    initialCampaign?.description || ""
  );
  const [status, setStatus] = useState<CampaignStatus>(
    initialCampaign?.status || CampaignStatus.ACTIVE
  );
  const [leadsText, setLeadsText] = useState(
    initialCampaign?.leads.join("\n") || ""
  );
  const [accountIDsText, setAccountIDsText] = useState(
    initialCampaign?.accountIDs.join("\n") || ""
  );

  const isEditing = !!initialCampaign;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !description) {
      setError("Please fill in all required fields");
      return;
    }

    // Parse leads and account IDs from textarea
    const leads = leadsText.trim().split("\n").filter(Boolean);
    const accountIDs = accountIDsText.trim().split("\n").filter(Boolean);

    // Validate leads as LinkedIn URLs
    const invalidLeads = leads.filter(
      (lead) =>
        !lead.startsWith("https://linkedin.com/") &&
        !lead.startsWith("https://www.linkedin.com/")
    );
    if (invalidLeads.length > 0) {
      setError(
        `Some leads are not valid LinkedIn URLs: ${invalidLeads.join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (isEditing && initialCampaign) {
        // Update existing campaign
        const updatePayload: UpdateCampaignPayload = {
          id: initialCampaign.id,
          name,
          description,
          status,
          leads,
          accountIDs,
        };

        result = await campaignApi.update(updatePayload);
      } else {
        // Create new campaign
        const createPayload: CreateCampaignPayload = {
          name,
          description,
          status,
          leads,
          accountIDs,
        };

        result = await campaignApi.create(createPayload);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Campaign submission error:", err);
      setError(`Failed to ${isEditing ? "update" : "create"} campaign`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-card p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Campaign" : "Create New Campaign"}
      </h2>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Campaign Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as CampaignStatus)}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CampaignStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={CampaignStatus.INACTIVE}>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="leads" className="text-sm font-medium">
            LinkedIn Leads (one URL per line)
          </label>
          <textarea
            id="leads"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={4}
            value={leadsText}
            onChange={(e) => setLeadsText(e.target.value)}
            placeholder="https://linkedin.com/in/profile-1&#10;https://linkedin.com/in/profile-2"
          />
          <p className="text-xs text-muted-foreground">
            Enter LinkedIn profile URLs, one per line
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="accountIDs" className="text-sm font-medium">
            LinkedIn Profile IDs (one ID per line)
          </label>
          <textarea
            id="accountIDs"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={2}
            value={accountIDsText}
            onChange={(e) => setAccountIDsText(e.target.value)}
            placeholder="profile-id-123&#10;profile-id-456"
          />
          <p className="text-xs text-muted-foreground">
            Enter LinkedIn profile IDs, one per line
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Campaign"
              : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}
