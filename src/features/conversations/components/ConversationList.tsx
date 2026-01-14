import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Conversation } from "../types/conversation.types";
import { MessageSquare, Bot, User } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getChannelEmoji = (channel: string) => {
  const emojis: Record<string, string> = {
    whatsapp: "💬",
    web_chat: "🌐",
    instagram: "📷",
    facebook: "👥",
    telegram: "✈️",
    sms: "📱",
    email: "✉️",
  };
  return emojis[channel] || "💬";
};

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => {
          const isActive = !conversation.ended_at;
          const isSelected = conversation.id === selectedId;

          return (
            <div
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all",
                "hover:bg-muted/80",
                isSelected && "bg-muted"
              )}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(conversation.channel_identifier)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-sm truncate">
                    {conversation.channel_identifier}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(conversation.started_at), { addSuffix: false })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                    <span>{getChannelEmoji(conversation.channel)}</span>
                    <span className="capitalize">{conversation.channel.replace('_', ' ')}</span>
                    {conversation.ai_enabled && (
                      <Bot className="h-3 w-3 ml-1 text-primary" />
                    )}
                  </p>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {conversations.length === 0 && (
          <div className="text-center py-12 text-muted-foreground px-4">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No conversations found</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
