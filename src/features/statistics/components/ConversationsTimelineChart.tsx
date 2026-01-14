import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import type { TimelineDataPoint } from '../types/statistics.types';
import { format } from 'date-fns';

interface ConversationsTimelineChartProps {
  data: TimelineDataPoint[];
  title?: string;
  description?: string;
}

const chartConfig = {
  count: {
    label: 'Conversations',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function ConversationsTimelineChart({
  data,
  title = 'Conversations Timeline',
  description = 'Conversation activity over time'
}: ConversationsTimelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--color-count))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--color-count))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                try {
                  return format(new Date(value), 'MMM dd');
                } catch {
                  return value;
                }
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    try {
                      return format(new Date(value), 'PPP');
                    } catch {
                      return value;
                    }
                  }}
                />
              }
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillCount)"
              stroke="hsl(var(--color-count))"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
