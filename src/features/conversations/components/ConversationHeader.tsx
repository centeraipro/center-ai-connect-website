import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Bot, PhoneOff } from "lucide-react";
import type { Conversation } from "../types/conversation.types";
import { useEndConversation, useToggleAI } from "../hooks/useConversations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationHeaderProps {
  conversation: Conversation;
}

const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  const endConversation = useEndConversation();
  const toggleAI = useToggleAI();

  const handleEndConversation = async () => {
    await endConversation.mutateAsync(conversation.id);
  };

  const handleToggleAI = async (enabled: boolean) => {
    await toggleAI.mutateAsync({ id: conversation.id, payload: { enabled } });
  };

  const isActive = !conversation.ended_at;

  return (
    <div className="flex items-center justify-between border-b bg-background px-6 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(conversation.channel_identifier)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{conversation.channel_identifier}</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {isActive ? 'Active now' : 'Conversation ended'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={conversation.ai_enabled}
            onCheckedChange={handleToggleAI}
            disabled={!isActive}
            id="ai-toggle"
          />
          <Label htmlFor="ai-toggle" className="text-sm cursor-pointer flex items-center gap-1">
            <Bot className="h-4 w-4" />
            AI
          </Label>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isActive && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <PhoneOff className="mr-2 h-4 w-4" />
                    End Conversation
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>End Conversation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will mark the conversation as ended. You won't be able to send more messages.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleEndConversation}>
                      End Conversation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
