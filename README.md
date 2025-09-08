# Hospitality AI Concierge with Ollama

This is a hospitality-focused AI concierge application that uses Ollama with the llama3.1:latest model. It consists of a simple Express backend and a Next.js frontend with TailwindCSS styling.

## Prerequisites

1. [Node.js](https://nodejs.org/) (v18 or higher)
2. [Ollama](https://ollama.com/) installed on your machine

## Setup

### 1. Install Ollama

Download and install Ollama from [https://ollama.com/](https://ollama.com/)

### 2. Pull the llama3.1 model

Open a terminal and run:

```bash
ollama pull llama3.1:latest
```

### 3. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:5001

### 4. Start the Frontend

```bash
cd frontend/ava-ai-frontend
npm install
npm run dev
```

The frontend will start on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Type a message in the input field and press Send
3. The AI will respond with a message

## Features

- Professional hospitality-focused concierge AI assistant
- Modern, responsive chat interface with TailwindCSS
- Uses Ollama with the llama3.1:latest model
- Backend API with hospitality system prompt
- Warm, helpful, and courteous AI responses
- Error handling for backend connection issues

## API Endpoints

- `POST /api/intelligence/chat` - Send a message to the AI
- `GET /api/models` - Get a list of available models
- `GET /api/test` - Test if the backend is running

**Note:** The backend runs on port 5001 by default

## Troubleshooting

1. Make sure Ollama is running
2. Make sure you have pulled the llama3.1:latest model
3. Check the backend console for any errors
4. Ensure both backend and frontend are running
