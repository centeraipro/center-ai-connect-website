import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ImageIcon, Paperclip } from "lucide-react";
import { conversationService } from "../services/conversationService";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  conversationId: number;
  disabled?: boolean;
}

export function MessageInput({ conversationId, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await conversationService.sendAdminMessage(conversationId, { message: message.trim() });
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background px-6 py-4">
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground flex-shrink-0"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          disabled={disabled || isSending}
        />

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isSending}
          size="icon"
          className={cn(
            "rounded-full h-9 w-9 flex-shrink-0 transition-all",
            !message.trim() && "opacity-50"
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
