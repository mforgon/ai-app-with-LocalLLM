import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

    const response = await axios.post(`${OLLAMA_API}/generate`, {
      model,
      prompt: fullPrompt,
      stream: false,
    });

    return res.json({ response: response.data.response });
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
  res.json({ message: "Backend is running!" });
});

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
