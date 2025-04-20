import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { CampaignList } from "./components/campaigns/CampaignList";
import { CampaignForm } from "./components/campaigns/CampaignForm";
import { CampaignDetails } from "./components/campaigns/CampaignDetails";
import LinkedInProfileParser from "./components/linkedin/LinkedInProfileParser";
import { Campaign } from "./lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { toast } from "sonner";

type AppView = "list" | "create" | "details" | "edit";

function App() {
  const [view, setView] = useState<AppView>("list");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  // Log view state changes
  useEffect(() => {
    console.log("Current view:", view);
  }, [view]);

  // Handle view changes
  const handleSelectCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setView("details");
  };

  const handleCreateNew = () => {
    console.log("handleCreateNew called");
    setView("create");
    toast("Create campaign form opened");
  };

  const handleBack = () => {
    setView("list");
  };

  const handleEdit = () => {
    setView("edit");
  };

  const handleCampaignCreated = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setView("details");
    toast("Campaign created successfully!");
  };

  const handleCampaignUpdated = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setView("details");
  };

  const handleCampaignDeleted = () => {
    setSelectedCampaign(null);
    setView("list");
  };
  
  const handleCampaignStatusChange = (updatedCampaign: Campaign) => {
    if (selectedCampaign) {
      setSelectedCampaign(updatedCampaign);
    }
  };

  return (
    <Layout>
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="linkedin-parser">LinkedIn Parser</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          {view === "list" && (
            <CampaignList
              onSelectCampaign={handleSelectCampaign}
              onCreateNew={handleCreateNew}
            />
          )}

          {view === "create" && (
            <CampaignForm
              onSuccess={handleCampaignCreated}
              onCancel={handleBack}
            />
          )}

          {view === "edit" && selectedCampaign && (
            <CampaignForm
              initialCampaign={selectedCampaign}
              onSuccess={handleCampaignUpdated}
              onCancel={() => setView("details")}
            />
          )}

          {view === "details" && selectedCampaign && (
            <CampaignDetails
              campaign={selectedCampaign}
              onEdit={handleEdit}
              onBack={handleBack}
              onDeleted={handleCampaignDeleted}
              onStatusChange={handleCampaignStatusChange}
            />
          )}
        </TabsContent>

        <TabsContent value="linkedin-parser">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              LinkedIn Profile Parser
            </h2>
            <p className="text-muted-foreground mb-6">
              Use this tool to generate personalized outreach messages for
              LinkedIn profiles.
            </p>
            <LinkedInProfileParser />
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

export default App;
