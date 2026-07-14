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

app.get("/api/images", async (req, res) => {
    try {
        const images = await getUrls();
        res.json(JSON.parse(images));
    } catch {
        console.error(error);
        res.status(500).json({
            error: "Failed to load images"
        });
    }
});

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