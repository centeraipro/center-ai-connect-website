import { MessageSquareIcon, ClockIcon, MessagesSquareIcon, ActivityIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useStatistics } from "@/features/dashboard/hooks/useStatistics"

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
};

export function SectionCards() {
  const { statistics, isLoading, error } = useStatistics();

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load statistics: {error}
      </div>
    );
  }

  if (isLoading || !statistics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const { conversations, responseTime, messages } = statistics;

  // Provide default values if data is incomplete
  const conversationData = {
    total: conversations?.total ?? 0,
    active: conversations?.active ?? 0,
    ended: conversations?.ended ?? 0,
  };

  const responseTimeData = {
    average_seconds: responseTime?.average_seconds ?? 0,
    median_seconds: responseTime?.median_seconds ?? 0,
    min_seconds: responseTime?.min_seconds ?? 0,
    max_seconds: responseTime?.max_seconds ?? 0,
  };

  const messageData = {
    total: messages?.total ?? 0,
    by_sender_type: {
      customer: messages?.by_sender_type?.customer ?? 0,
      ai_agent: messages?.by_sender_type?.ai_agent ?? 0,
      admin: messages?.by_sender_type?.admin ?? 0,
    },
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Conversations</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {conversationData.total.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ActivityIcon className="size-3" />
              {conversationData.active} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {conversationData.active} active · {conversationData.ended} ended
          </div>
          <div className="text-muted-foreground">
            Last 7 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Response Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatTime(responseTimeData.average_seconds)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ClockIcon className="size-3" />
              {formatTime(responseTimeData.median_seconds)} median
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Min: {formatTime(responseTimeData.min_seconds)} · Max: {formatTime(responseTimeData.max_seconds)}
          </div>
          <div className="text-muted-foreground">
            AI response metrics
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {messageData.total.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <MessagesSquareIcon className="size-3" />
              {messageData.by_sender_type.ai_agent} AI
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {messageData.by_sender_type.customer} customers · {messageData.by_sender_type.admin} admins
          </div>
          <div className="text-muted-foreground">
            Message breakdown
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Engagement Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {conversationData.total > 0
              ? ((conversationData.active / conversationData.total) * 100).toFixed(1)
              : '0.0'}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ActivityIcon className="size-3" />
              {messageData.total > 0 && conversationData.total > 0
                ? (messageData.total / conversationData.total).toFixed(1)
                : '0'} msgs/conv
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active conversation rate
          </div>
          <div className="text-muted-foreground">
            Engagement metrics
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
