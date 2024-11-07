import { cn } from "@/lib/utils";
import { Message } from "ai";
import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown'

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div
      className={cn("group relative mb-4 flex items-start gap-4 px-4", {
        "flex-row-reverse": message.role === "user",
      })}
    >
      <Avatar className={cn("flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow", {
        "bg-primary text-white": message.role === "user",
        "bg-muted": message.role === "assistant"
      })}>
        {message.role === "user" ? (
          <User className="h-5 w-5" />
        ) : (
          <Bot className="h-5 w-5" />
        )}
      </Avatar>
      <Card className={cn("flex-1 max-w-[85%] overflow-hidden rounded-lg px-4 py-3 shadow-md", {
        "bg-primary text-primary-foreground": message.role === "user",
        "bg-muted": message.role === "assistant"
      })}>
        <div className="prose break-words dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}