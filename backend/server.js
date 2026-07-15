import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getRecommendations } from "./gemini.js";
import { getUrls } from "./getImageUrls.js";
import { supabase } from "./db.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..")));

supabase;
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.post("/api/recommendations", async (req, res) => {
    try {
        const { category, genre, mood, additionalInfo } = req.body;

        const output = JSON.parse(await getRecommendations(category, genre, mood, additionalInfo));
        const imageUrls = await getUrls(category, output);
        console.log("category received:", category);
        console.log("imageUrls returned:", imageUrls);

        output.recommendations = output.recommendations.map((recommendation, index) => ({
            title: recommendation.title,
            description: recommendation.description,
            imageUrl: imageUrls[index]
        }));
        res.json(output);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to generate recommendations", details: error.message,
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});