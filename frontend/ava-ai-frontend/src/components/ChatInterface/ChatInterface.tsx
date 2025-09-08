"use client";

import { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // Check if backend is running
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/test");
        if (response.ok) {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (error) {
        console.error("Backend connection error:", error);
        setIsBackendConnected(false);
      }
    };

    checkBackend();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/intelligence/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: input.trim(),
            model: "llama3.1:latest",
          }),
        }
      );

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5 h-screen flex flex-col">
      {!isBackendConnected && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-5 text-center">
          <p>
            ⚠️ Cannot connect to backend server. Please make sure it&apos;s
            running at http://localhost:5001
          </p>
          <p>Also ensure Ollama is running with the llama3.1:latest model.</p>
        </div>
      )}

      <div className="flex-grow overflow-y-auto mb-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center p-5 text-gray-600 bg-blue-50 rounded-lg">
            <p className="text-xl font-semibold mb-2">
              👋 Welcome to our Hospitality AI Assistant!
            </p>
            <p className="mb-2">
              I&apos;m here to provide you with exceptional service and
              assistance.
            </p>
            <p>How may I help you today?</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-600 text-white ml-[20%]"
                : "bg-gray-200 text-gray-800 mr-[20%]"
            }`}
          >
            <div className="font-medium mb-1">
              {message.role === "user" ? "You:" : "Concierge:"}
            </div>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="text-center p-3 text-gray-500 italic">
            Processing your request...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How may I assist you today?"
          disabled={isLoading || !isBackendConnected}
          className="flex-grow p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading || !isBackendConnected}
          className="px-5 py-3 bg-blue-600 text-white border-none rounded-md cursor-pointer text-base transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
