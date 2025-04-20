import { useState } from "react";
import { Campaign } from "../../lib/types";
import { campaignApi, linkedinApi } from "../../lib/api";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LinkedInProfileParser from "../linkedin/LinkedInProfileParser";

interface CampaignDetailsProps {
  campaign: Campaign;
  onEdit: () => void;
  onBack: () => void;
  onDeleted: () => void;
}

export function CampaignDetails({
  campaign,
  onEdit,
  onBack,
  onDeleted,
}: CampaignDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [personalizedMessages, setPersonalizedMessages] = useState<
    Record<string, string>
  >({});
  const [processingUrl, setProcessingUrl] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await campaignApi.delete(campaign.id);
      onDeleted();
    } catch (err) {
      console.error("Error deleting campaign:", err);
      setError("Failed to delete campaign");
      setIsDeleting(false);
    }
  }

  async function generateMessage(url: string) {
    if (personalizedMessages[url]) {
      return; // Already generated
    }

    setProcessingUrl(url);
    setError(null);

    try {
      const response = await linkedinApi.generatePersonalizedMessage(url);
      setPersonalizedMessages((prev) => ({
        ...prev,
        [url]: response.message,
      }));
      setSuccessMessage("Message generated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error generating message:", err);
      setError("Failed to generate personalized message");
    } finally {
      setProcessingUrl(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back to Campaigns
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={onEdit}>
            Edit Campaign
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Campaign"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{campaign.name}</h2>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              campaign.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {campaign.status}
          </span>
        </div>

        <p className="text-muted-foreground mb-6">{campaign.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="text-muted-foreground">Created:</span>{" "}
            {new Date(campaign.createdAt).toLocaleDateString()}
          </div>
          <div>
            <span className="text-muted-foreground">Updated:</span>{" "}
            {new Date(campaign.updatedAt).toLocaleDateString()}
          </div>
          <div>
            <span className="text-muted-foreground">Total Leads:</span>{" "}
            {campaign.leads.length}
          </div>
          <div>
            <span className="text-muted-foreground">Accounts:</span>{" "}
            {campaign.accountIDs.length}
          </div>
        </div>

        <Tabs defaultValue="leads">
          <TabsList className="mb-4">
            <TabsTrigger value="leads">LinkedIn Leads</TabsTrigger>
            <TabsTrigger value="accounts">Account IDs</TabsTrigger>
            <TabsTrigger value="parser">Profile Parser</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <h3 className="font-medium">LinkedIn Profiles</h3>
            {campaign.leads.length === 0 ? (
              <p className="text-muted-foreground">
                No leads added to this campaign yet.
              </p>
            ) : (
              <div className="space-y-4">
                {campaign.leads.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="border rounded-md p-4 bg-background"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {url}
                      </a>
                      <Button
                        size="sm"
                        onClick={() => generateMessage(url)}
                        disabled={
                          !!processingUrl || !!personalizedMessages[url]
                        }
                      >
                        {processingUrl === url
                          ? "Generating..."
                          : personalizedMessages[url]
                          ? "Generated"
                          : "Generate Message"}
                      </Button>
                    </div>
                    {personalizedMessages[url] && (
                      <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                        <h4 className="font-medium mb-1">
                          Personalized Message:
                        </h4>
                        <p>{personalizedMessages[url]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="accounts">
            <h3 className="font-medium mb-2">Account IDs</h3>
            {campaign.accountIDs.length === 0 ? (
              <p className="text-muted-foreground">
                No accounts configured for this campaign.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {campaign.accountIDs.map((id, index) => (
                  <div
                    key={`${id}-${index}`}
                    className="border rounded-md p-3 bg-background text-sm"
                  >
                    {id}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="parser">
            <LinkedInProfileParser />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
