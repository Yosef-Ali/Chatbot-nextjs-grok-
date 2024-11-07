"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { ChatMessage } from "@/components/chat-message";
import { ChatPanel } from "@/components/chat-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm Grok, your AI assistant. I aim to be helpful while keeping things light and fun. How can I assist you today?",
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
      });
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-muted">
      <header className="sticky top-0 z-50 flex items-center gap-2 bg-background/50 backdrop-blur-xl border-b px-4 py-3">
        <Bot className="w-6 h-6 text-blue-500" />
        <h1 className="font-semibold">Grok AI Assistant</h1>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto py-4 px-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t">
        <div className="max-w-3xl mx-auto">
          <ChatPanel
            isLoading={isLoading}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}