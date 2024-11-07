"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatPanelProps {
  isLoading: boolean;
  input: string;
  error?: Error;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ChatPanel({
  isLoading,
  input,
  error,
  handleInputChange,
  handleSubmit,
}: ChatPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      try {
        await handleSubmit(e as any);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    handleInputChange(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="relative flex max-w-2xl mx-auto items-center">
        <Textarea
          ref={textareaRef}
          tabIndex={0}
          rows={1}
          value={input}
          onChange={handleTextareaChange}
          placeholder="Send a message..."
          spellCheck={false}
          disabled={isLoading}
          className="min-h-[52px] w-full resize-none bg-background pr-12 text-base py-3 focus-visible:ring-1 disabled:opacity-50"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !isLoading &&
              (e.metaKey || !e.metaKey)
            ) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity"
        >
          <SendHorizontal
            className={`h-4 w-4 ${isLoading ? "opacity-50" : ""}`}
          />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}