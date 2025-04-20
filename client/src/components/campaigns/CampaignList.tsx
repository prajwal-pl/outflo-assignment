import { useEffect, useState } from "react";
import { Campaign } from "../../lib/types";
import { campaignApi } from "../../lib/api";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface CampaignListProps {
  onSelectCampaign: (campaign: Campaign) => void;
  onCreateNew: () => void;
}

export function CampaignList({
  onSelectCampaign,
  onCreateNew,
}: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        const data = await campaignApi.fetchAll();
        setCampaigns(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch campaigns");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  const handleCreateClick = () => {
    console.log("Create campaign button clicked");
    toast("Opening campaign form");
    onCreateNew();
  };

  if (loading) {
    return <div className="text-center py-4">Loading campaigns...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-destructive">
        {error}
        <Button
          variant="outline"
          className="ml-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Campaigns</h2>
        <Button
          onClick={handleCreateClick}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Create Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No campaigns found. Create your first campaign to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border rounded-md p-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => onSelectCampaign(campaign)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{campaign.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    campaign.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {campaign.description}
              </p>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <span>{campaign.leads.length} leads</span>
                <span className="mx-2">•</span>
                <span>{campaign.accountIDs.length} accounts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
