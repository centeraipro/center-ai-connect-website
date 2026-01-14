import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface BarChartDataItem {
  label: string;
  value: number;
}

interface HorizontalBarChartProps {
  data: BarChartDataItem[];
  title: string;
  description?: string;
  valueFormatter?: (value: number) => string;
  dataKey?: string;
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function HorizontalBarChart({
  data,
  title,
  description,
  valueFormatter = (val) => val.toLocaleString(),
  dataKey = 'value'
}: HorizontalBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 20 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={80}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={(value) => valueFormatter(Number(value))} />}
            />
            <Bar dataKey={dataKey} fill="hsl(var(--color-value))" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
