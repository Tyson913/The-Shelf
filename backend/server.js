import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getRecommendations } from "./gemini.js";
import { getUrls } from "./getImageUrls.js";
import { signUp, logIn, saveConvo, getUserIdFromToken, getConversations } from "./db.js";

const app = express();

async function withRetry(fn, { retries = 3, baseDelay = 800, onRetry } = {}) {
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn(attempt);
        } catch (err) {
            lastErr = err;
            if (!isRetryableGeminiError(err) || attempt === retries) throw err;

            const delay = baseDelay * 2 ** attempt + Math.random() * 300; 
            if (onRetry) onRetry(attempt, delay, err);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastErr;
}

function isRetryableGeminiError(err) {
    const status = err?.status ?? err?.code ?? err?.response?.status;
    if (status === 503 || status === 429) return true;

    const message = err?.message || "";
    return /"code":\s*(503|429)/.test(message) || /UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());


app.use(async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    req.userId = await getUserIdFromToken(token);
    next();
});


function requireAuth(req, res, next) {
    if (!req.userId) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
}

app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.post("/api/recommendations", async (req, res) => {
    const { category, genre, mood, additionalInfo } = req.body;
    let output = null;

    try {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        output = await withRetry(
            async (attempt) => {
                if (attempt > 0) {
                    res.write(`event: retry\ndata: ${JSON.stringify({ attempt })}\n\n`);
                }

                const stream = await getRecommendations(category, genre, mood, additionalInfo);

                let fullText = "";
                for await (const chunk of stream) {
                    const piece = chunk.text || "";
                    fullText += piece;
                    res.write(`event: chunk\ndata: ${JSON.stringify({ text: piece })}\n\n`);
                }

                const cleaned = fullText.replace(/```json|```/g, "").trim();
                return JSON.parse(cleaned);
            },
            {
                onRetry: (attempt, delay, err) => {
                    console.warn(
                        `Gemini call failed (attempt ${attempt + 1}), retrying in ${Math.round(delay)}ms:`,
                        err.message
                    );
                },
            }
        );

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

    if (output) {
        await saveConvo(
            { category, genre, mood, additionalInfo },
            output,
            req.userId
        );
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const result = await logIn(email, password);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid email or password" });
    }
});


app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Email, and password are required" });
    }

    try {
        const result = await signUp(email, password);
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Signup failed" });
    }
});

app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
        const conversations = await getConversations(req.userId);
        return res.status(200).json({ conversations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to load conversation history" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
