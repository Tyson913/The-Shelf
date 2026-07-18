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

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const stream = await getRecommendations(category, genre, mood, additionalInfo);

        let fullText = "";
        for await (const chunk of stream) {
            const piece = chunk.text || "";
            fullText += piece;
            res.write(`event: chunk\ndata: ${JSON.stringify({ text: piece })}\n\n`);
        }

        const cleaned = fullText.replace(/```json|```/g, "").trim();
        const output = JSON.parse(cleaned);

        const imageUrls = await getUrls(category, output);
        console.log("category received:", category);
        console.log("imageUrls returned:", imageUrls);

        output.recommendations = output.recommendations.map((recommendation, index) => ({
            title: recommendation.title,
            description: recommendation.description,
            imageUrl: imageUrls[index]
        }));

        res.write(`event: done\ndata: ${JSON.stringify(output)}\n\n`);
        res.end();
        
    } catch (error) {
        console.error(error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: "Failed to generate recommendations", details: error.message })}\n\n`);
        res.end();
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});