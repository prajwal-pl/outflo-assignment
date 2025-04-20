import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import campaignRoutes from "./routes/campaign.route";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/campaigns", campaignRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
