import { useState } from "react";
import { linkedinApi } from "../../lib/api";
import { Button } from "../ui/button";

export default function LinkedInProfileParser() {
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!linkedInUrl.trim()) {
      setError("Please enter a LinkedIn URL");
      return;
    }

    if (!linkedInUrl.includes("linkedin.com")) {
      setError("Please enter a valid LinkedIn URL");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await linkedinApi.generatePersonalizedMessage(
        linkedInUrl
      );
      setMessage(response.message);
    } catch (err) {
      console.error("Error generating message:", err);
      setError("Failed to generate personalized message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">LinkedIn Profile Parser</h3>
      <p className="text-sm text-muted-foreground">
        Enter a LinkedIn URL to generate a personalized outreach message based
        on the profile data.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="linkedin-url" className="text-sm font-medium">
            LinkedIn Profile URL
          </label>
          <input
            id="linkedin-url"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            disabled={isSubmitting}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Message"}
        </Button>
      </form>

      {message && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Generated Message:</h4>
          <div className="bg-muted p-4 rounded-md border">
            <p className="text-sm whitespace-pre-wrap">{message}</p>
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(message)}
            >
              Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
