import express from "express";
import cors from "cors";
import { getRecommendations } from "./gemini.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/recommendations", async (req, res) => {
    try {
        const result = await getRecommendations(req.body);
        res.json(JSON.parse(result));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to generate recommendations"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});