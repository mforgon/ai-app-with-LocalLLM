"use client";

import { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  id?: string; // Optional ID to track messages during streaming
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function ChatInterface() {
  // CSS for the blinking cursor
  const cursorStyle = `
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .typing-cursor {
      display: inline-block;
      animation: blink 1s step-end infinite;
      margin-left: 2px;
    }
  `;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Check if backend is running and fetch FAQs
  useEffect(() => {
    const checkBackendAndFetchFaqs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/test`
        );
        if (response.ok) {
          setIsBackendConnected(true);
          const faqsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_APP_API_URL}/faqs`
          );
          if (faqsResponse.ok) {
            const faqsData = await faqsResponse.json();
            setFaqs(faqsData);
          }
        } else {
          setIsBackendConnected(false);
        }
      } catch (error) {
        console.error("Backend connection error:", error);
        setIsBackendConnected(false);
      }
    };

    checkBackendAndFetchFaqs();
  }, []);

  const handleFaqClick = async (question: string) => {
    // Add the question as a user message
    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Add an empty assistant message that will be updated as the stream comes in
    const assistantMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", id: assistantMessageId },
    ]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/intelligence/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: question,
            model: "llama3.1:latest",
          }),
        }
      );

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));

              if (data.chunk) {
                // Append the new chunk to the accumulated content
                accumulatedContent += data.chunk;

                // Update the assistant message with the accumulated content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }

              if (data.done) {
                // Stream is complete
                setIsLoading(false);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Sorry, there was an error processing your request.",
              }
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  // Function to generate relevant questions based on conversation context
  const generateRelevantQuestions = (conversation: Message[]): string[] => {
    // This is a simple implementation - in a real app, you might use AI to generate these
    // or have a more sophisticated algorithm to determine relevant questions

    // Default questions for any conversation
    const defaultQuestions = [
      "What amenities are available at the hotel?",
      "What are the dining options?",
      "Is there a shuttle service to nearby attractions?",
    ];

    // If the conversation is about dining, suggest dining-related questions
    if (
      conversation.some(
        (msg) =>
          msg.content.toLowerCase().includes("restaurant") ||
          msg.content.toLowerCase().includes("dining") ||
          msg.content.toLowerCase().includes("food") ||
          msg.content.toLowerCase().includes("breakfast")
      )
    ) {
      return [
        "What are the restaurant opening hours?",
        "Do you offer room service?",
        "Are there vegetarian or vegan options available?",
      ];
    }

    // If the conversation is about amenities, suggest amenity-related questions
    if (
      conversation.some(
        (msg) =>
          msg.content.toLowerCase().includes("pool") ||
          msg.content.toLowerCase().includes("gym") ||
          msg.content.toLowerCase().includes("spa") ||
          msg.content.toLowerCase().includes("amenities")
      )
    ) {
      return [
        "What are the pool hours?",
        "Does the gym have personal trainers?",
        "How can I book a spa treatment?",
      ];
    }

    // If the conversation is about check-in/check-out, suggest related questions
    if (
      conversation.some(
        (msg) =>
          msg.content.toLowerCase().includes("check-in") ||
          msg.content.toLowerCase().includes("check-out") ||
          msg.content.toLowerCase().includes("luggage")
      )
    ) {
      return [
        "Is early check-in available?",
        "Can I request a late check-out?",
        "Do you offer luggage storage?",
      ];
    }

    return defaultQuestions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add an empty assistant message that will be updated as the stream comes in
    const assistantMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", id: assistantMessageId },
    ]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/intelligence/chat`,
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

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is not readable");

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));

              if (data.chunk) {
                // Append the new chunk to the accumulated content
                accumulatedContent += data.chunk;

                // Update the assistant message with the accumulated content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }

              if (data.done) {
                // Stream is complete
                setIsLoading(false);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: "Sorry, there was an error processing your request.",
              }
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5 h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: cursorStyle }} />
      {!isBackendConnected && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-5 text-center">
          <p>
            ⚠️ Cannot connect to backend server. Please make sure it&apos;s
            running at {process.env.NEXT_PUBLIC_APP_API_URL}
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
            <div className="mt-5">
              <h3 className="font-semibold mb-2">
                Frequently Asked Questions:
              </h3>
              <div className="space-y-2">
                {faqs.slice(0, 3).map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleFaqClick(faq.question)}
                    className="w-full text-left p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white ml-[20%]"
                  : "bg-gray-200 text-gray-800 mr-[20%]"
              }`}
            >
              <div className="font-medium mb-1">
                {message.role === "user" ? "You:" : "Concierge:"}
              </div>
              <p className="whitespace-pre-wrap">
                {message.content}
                {isLoading && message.role === "assistant" && message.id && (
                  <span className="typing-cursor">|</span>
                )}
              </p>
            </div>

            {/* Show relevant questions after assistant responses */}
            {message.role === "assistant" &&
              message.content &&
              index === messages.length - 1 &&
              !isLoading && (
                <div className="mb-6 mt-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Related questions you might want to ask:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* Generate relevant questions based on the current conversation context */}
                    {generateRelevantQuestions(messages).map(
                      (question, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleFaqClick(question)}
                          className="text-sm text-left  text-gray-600 p-2  bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                        >
                          {question}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
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
