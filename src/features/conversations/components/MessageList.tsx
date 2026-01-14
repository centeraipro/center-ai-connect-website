import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "../types/conversation.types";
import { format } from "date-fns";
import { User, Bot, Shield } from "lucide-react";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

const senderIcons = {
  customer: User,
  ai_agent: Bot,
  admin: Shield,
};

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => {
          const Icon = senderIcons[message.sender_type];
          const isOutgoing = message.sender_type === 'admin' || message.sender_type === 'ai_agent';
          const isAI = message.sender_type === 'ai_agent';

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                isOutgoing && "justify-end"
              )}
            >
              {!isOutgoing && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-500/10 text-blue-600">
                    <Icon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={cn("max-w-[70%]", isOutgoing && "flex flex-col items-end")}>
                <div
                  className={cn(
                    "rounded-lg p-3 break-words",
                    isOutgoing
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  )}
                >
                  {message.message_type === 'text' ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="space-y-2">
                      {message.media_url && (
                        <div className="text-sm">
                          {message.message_type === 'image' && '📷 Image'}
                          {message.message_type === 'audio' && '🎵 Audio'}
                          {message.message_type === 'document' && '📄 Document'}
                          {message.message_type === 'video' && '🎥 Video'}
                        </div>
                      )}
                      {message.caption && (
                        <p className="text-sm">{message.caption}</p>
                      )}
                    </div>
                  )}
                </div>
                {isAI && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Bot className="h-3 w-3" />
                    <span>AI Agent</span>
                  </div>
                )}
              </div>

              {isOutgoing && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={cn(
                    isAI
                      ? "bg-purple-500/10 text-purple-600"
                      : "bg-primary/10 text-primary"
                  )}>
                    <Icon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No messages yet</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
