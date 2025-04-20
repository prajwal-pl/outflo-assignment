import { useEffect, useState } from "react";
import { Campaign, CampaignStatus } from "../../lib/types";
import { campaignApi } from "../../lib/api";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch"; 
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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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

  const handleStatusToggle = async (campaign: Campaign, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the card when toggling switch
    
    const newStatus = campaign.status === CampaignStatus.ACTIVE 
      ? CampaignStatus.INACTIVE 
      : CampaignStatus.ACTIVE;
    
    setUpdatingStatus(campaign.id);
    
    try {
      const updatedCampaign = await campaignApi.update({
        id: campaign.id,
        status: newStatus,
      });
      
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((c) =>
          c.id === campaign.id ? updatedCampaign : c
        )
      );
      
      toast(`Campaign status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating campaign status:", err);
      toast.error("Failed to update campaign status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading campaigns...</div>;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <Button
            onClick={handleCreateClick}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Create Campaign
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-lg bg-destructive/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-destructive mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2 text-destructive">{error}</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            There was a problem fetching campaigns. You can try again or create a new campaign.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
            <Button 
              onClick={handleCreateClick}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Create New Campaign
            </Button>
          </div>
        </div>
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
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed rounded-lg bg-muted/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-muted-foreground mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            You haven't created any campaigns yet. Create your first campaign to start engaging with leads on LinkedIn.
          </p>
          <Button 
            onClick={handleCreateClick}
            size="lg"
            className="bg-primary text-white hover:bg-primary/90"
          >
            Create Your First Campaign
          </Button>
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
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs text-muted-foreground">
                    {campaign.status === CampaignStatus.ACTIVE ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    checked={campaign.status === CampaignStatus.ACTIVE}
                    onCheckedChange={() => {}}
                    onClick={(e) => handleStatusToggle(campaign, e)}
                    disabled={updatingStatus === campaign.id}
                    className="cursor-pointer"
                  />
                </div>
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
