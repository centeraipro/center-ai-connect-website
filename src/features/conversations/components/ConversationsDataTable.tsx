import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ShoppingCart,
  Calendar,
  Bot,
  User,
  Phone,
  Mail,
  Hash,
} from "lucide-react";
import { format } from "date-fns";
import type { Conversation } from "../types/conversation.types";

// Channel icons mapping
const channelIcons = {
  whatsapp: Phone,
  instagram: Hash,
  facebook: Hash,
  telegram: Hash,
  sms: MessageSquare,
  email: Mail,
  web_chat: MessageSquare,
};

// Channel badge colors
const channelVariants = cva("capitalize", {
  variants: {
    channel: {
      whatsapp: "bg-green-500 hover:bg-green-600 text-white",
      instagram: "bg-pink-500 hover:bg-pink-600 text-white",
      facebook: "bg-blue-500 hover:bg-blue-600 text-white",
      telegram: "bg-sky-500 hover:bg-sky-600 text-white",
      sms: "bg-purple-500 hover:bg-purple-600 text-white",
      email: "bg-gray-500 hover:bg-gray-600 text-white",
      web_chat: "bg-indigo-500 hover:bg-indigo-600 text-white",
    },
  },
  defaultVariants: {
    channel: "web_chat",
  },
});

// Status badge variants
const statusVariants = cva("capitalize", {
  variants: {
    status: {
      active: "bg-green-500 hover:bg-green-600 text-white",
      ended: "bg-gray-500 hover:bg-gray-600 text-white",
    },
  },
  defaultVariants: {
    status: "active",
  },
});

// Order status badge variants
const orderStatusVariants = cva("capitalize text-xs", {
  variants: {
    status: {
      pending: "bg-yellow-500 hover:bg-yellow-600 text-white",
      confirmed: "bg-blue-500 hover:bg-blue-600 text-white",
      preparing: "bg-orange-500 hover:bg-orange-600 text-white",
      ready: "bg-purple-500 hover:bg-purple-600 text-white",
      in_delivery: "bg-indigo-500 hover:bg-indigo-600 text-white",
      completed: "bg-green-500 hover:bg-green-600 text-white",
      cancelled: "bg-red-500 hover:bg-red-600 text-white",
    },
  },
});

// Appointment status badge variants
const appointmentStatusVariants = cva("capitalize text-xs", {
  variants: {
    status: {
      scheduled: "bg-blue-500 hover:bg-blue-600 text-white",
      confirmed: "bg-green-500 hover:bg-green-600 text-white",
      in_progress: "bg-purple-500 hover:bg-purple-600 text-white",
      completed: "bg-teal-500 hover:bg-teal-600 text-white",
      cancelled: "bg-red-500 hover:bg-red-600 text-white",
      no_show: "bg-gray-500 hover:bg-gray-600 text-white",
    },
  },
});

type ColumnKey = "customer" | "channel" | "status" | "order" | "appointment" | "ai_enabled" | "started_at";

interface ConversationsDataTableProps {
  conversations: Conversation[];
  visibleColumns: Set<ColumnKey>;
  onConversationClick?: (conversation: Conversation) => void;
}

export const ConversationsDataTable = ({
  conversations,
  visibleColumns,
  onConversationClick,
}: ConversationsDataTableProps) => {
  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut" as const,
      },
    }),
  };

  const tableHeaders: { key: ColumnKey; label: string }[] = [
    { key: "customer", label: "Customer" },
    { key: "channel", label: "Channel" },
    { key: "status", label: "Status" },
    { key: "order", label: "Order" },
    { key: "appointment", label: "Appointment" },
    { key: "ai_enabled", label: "AI" },
    { key: "started_at", label: "Started" },
  ];

  const getCustomerInitials = (conversation: Conversation) => {
    if (conversation.customer) {
      return `${conversation.customer.first_name[0]}${conversation.customer.last_name[0]}`.toUpperCase();
    }
    return "??";
  };

  const getCustomerName = (conversation: Conversation) => {
    if (conversation.customer) {
      return `${conversation.customer.first_name} ${conversation.customer.last_name}`;
    }
    return "Unknown Customer";
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders
                .filter((header) => visibleColumns.has(header.key))
                .map((header) => (
                  <TableHead key={header.key}>{header.label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversations.length > 0 ? (
              conversations.map((conversation, index) => {
                const ChannelIcon = channelIcons[conversation.channel];
                return (
                  <motion.tr
                    key={conversation.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    onClick={() => onConversationClick?.(conversation)}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                  >
                    {visibleColumns.has("customer") && (
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getCustomerInitials(conversation)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{getCustomerName(conversation)}</span>
                            {conversation.customer?.email && (
                              <span className="text-xs text-muted-foreground">
                                {conversation.customer.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.has("channel") && (
                      <TableCell>
                        <Badge className={cn(channelVariants({ channel: conversation.channel as any }))}>
                          <ChannelIcon className="h-3 w-3 mr-1" />
                          {conversation.channel.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    )}

                    {visibleColumns.has("status") && (
                      <TableCell>
                        <Badge
                          className={cn(
                            statusVariants({
                              status: conversation.ended_at ? "ended" : "active",
                            })
                          )}
                        >
                          {conversation.ended_at ? "Ended" : "Active"}
                        </Badge>
                      </TableCell>
                    )}

                    {visibleColumns.has("order") && (
                      <TableCell>
                        {conversation.order ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-mono">{conversation.order.order_number}</span>
                            </div>
                            <Badge className={cn(orderStatusVariants({ status: conversation.order.status }))}>
                              {conversation.order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm"></span>
                        )}
                      </TableCell>
                    )}

                    {visibleColumns.has("appointment") && (
                      <TableCell>
                        {conversation.appointment ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(conversation.appointment.scheduled_start), "MMM d, h:mm a")}
                              </span>
                            </div>
                            <Badge
                              className={cn(
                                appointmentStatusVariants({ status: conversation.appointment.status })
                              )}
                            >
                              {conversation.appointment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm"></span>
                        )}
                      </TableCell>
                    )}

                    {visibleColumns.has("ai_enabled") && (
                      <TableCell>
                        {conversation.ai_enabled ? (
                          <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                            <Bot className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <User className="h-3 w-3 mr-1" />
                            Manual
                          </Badge>
                        )}
                      </TableCell>
                    )}

                    {visibleColumns.has("started_at") && (
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{format(new Date(conversation.started_at), "MMM d, yyyy")}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(conversation.started_at), "h:mm a")}
                          </span>
                        </div>
                      </TableCell>
                    )}
                  </motion.tr>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.size} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 opacity-50" />
                    <p>No conversations found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
