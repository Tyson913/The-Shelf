import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getRecommendations } from "./gemini.js";
import { getUrls } from "./getImageUrls.js" ;

const app = express();
const connectDB = require("./db.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..")));

connectDB();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.post("/api/recommendations", async (req, res) => {
    try {
        const output = JSON.parse(await getRecommendations(req.body));
        const imageUrls = JSON.parse(await getUrls(output));

        output.recommendations = output.recommendations.map((recommendation, index) => ({
            title: recommendation.title,
            description: recommendation.description,
            imageUrl: imageUrls[index]
        }));
        res.json(output);

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