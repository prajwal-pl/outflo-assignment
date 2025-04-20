import axios from "axios";
import type { RequestHandler } from "express";
import { generatedMessage } from "../lib/ai.js";

export const generatePersonalizedMessage: RequestHandler = async (req, res) => {
  const { url } = req.body;

  try {
    const rapidAPIURL =
      "https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url";

    const response = await axios.get(`${rapidAPIURL}?url=${url}`, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
      },
    });

    const company = response.data.position[0].companyName;
    const location = response.data.geo.full;

    const { firstName, lastName, summary } = response.data;

    // console.log(firstName, lastName, summary, company, location);

    const message = await generatedMessage({
      firstName,
      lastName,
      summary,
      company,
      location,
    });

    res.status(200).json({
      message: message,
    });
  } catch (error) {
    console.error("Error generating personalized message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
