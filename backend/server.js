import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ollama API endpoint
const OLLAMA_API = process.env.OLLAMA_API || "http://localhost:11434/api";

// Chat endpoint
app.post("/api/intelligence/chat", async (req, res) => {
  try {
    const { prompt, model = "llama3.1:latest" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Sending request to Ollama API with model: ${model}`);

    // Add hospitality-focused system prompt
    const systemPrompt = `You are a professional hospitality concierge assistant. Your tone is warm, helpful, and courteous. 

You should:
- Greet users warmly and professionally
- Provide detailed, helpful information about accommodations, dining, local attractions, and services
- Offer personalized recommendations based on user preferences
- Use polite, respectful language at all times
- Address users' concerns with empathy and understanding
- Provide clear, concise directions and instructions when needed
- End interactions with a courteous closing and an offer of further assistance

Your goal is to make users feel valued and well-cared for, as if they were guests at a luxury hotel.`;

    const fullPrompt = `<system>${systemPrompt}</system>\n\n${prompt}`;

    // Set response headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Make a streaming request to Ollama
    const response = await axios.post(
      `${OLLAMA_API}/generate`,
      {
        model,
        prompt: fullPrompt,
        stream: true,
      },
      {
        responseType: "stream",
      }
    );

    // Stream the response back to the client
    response.data.on("data", (chunk) => {
      try {
        const data = JSON.parse(chunk.toString());
        if (data.response) {
          res.write(`data: ${JSON.stringify({ chunk: data.response })}\n\n`);
        }
      } catch (error) {
        console.error("Error parsing chunk:", error);
      }
    });

    response.data.on("end", () => {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    });

    response.data.on("error", (error) => {
      console.error("Stream error:", error);
      res.end();
    });
  } catch (error) {
    console.error("Error calling Ollama API:", error.message);
    return res.status(500).json({
      error: "Failed to process request",
      details: error.message,
    });
  }
});

// Test endpoint
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  return res.status(200).json({ message: "Backend is running!" });
});

// Options for preflight requests
app.options('*', cors());

// Models list endpoint
app.get("/api/models", async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_API}/tags`);
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching models:", error.message);
    return res.status(500).json({
      error: "Failed to fetch models",
      details: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Ollama API endpoint: ${OLLAMA_API}`);
  console.log(`Make sure Ollama is running with the llama3.1:latest model`);
  console.log(`You can pull it using: ollama pull llama3.1:latest`);
});
