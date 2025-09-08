import ChatInterface from "@/components/ChatInterface/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <main>
        <h1 className="text-2xl font-bold text-center mb-8">Chat with Llama</h1>
        <ChatInterface />
      </main>
    </div>
  );
}
