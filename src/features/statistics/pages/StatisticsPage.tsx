import { useState, useMemo } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  MessageSquare,
  Users,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Clock,
  Bot,
  Activity,
} from 'lucide-react';

import { DateRangeFilter } from '../components/DateRangeFilter';
import { MetricCard } from '../components/MetricCard';
import { ConversationsTimelineChart } from '../components/ConversationsTimelineChart';
import { DistributionDonutChart } from '../components/DistributionDonutChart';
import { HorizontalBarChart } from '../components/HorizontalBarChart';

import {
  useConversationsTotal,
  useMessagesTotal,
  useConversationsTimeline,
  useResponseTime,
  useConversationDuration,
  useChannelsDistribution,
  useCustomerEngagement,
  useOrdersSummary,
  useAppointmentsSummary,
  useConversions,
  usePeakHours,
  useAIPerformance,
} from '../hooks/useStatistics';

export function StatisticsPage() {
  const [dateFilters, setDateFilters] = useState<{ startDate?: string; endDate?: string }>({});

  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    setDateFilters({ startDate, endDate });
  };

  // Fetch all statistics data
  const { data: conversationsTotal } = useConversationsTotal(dateFilters);
  const { data: messagesTotal } = useMessagesTotal(dateFilters);
  const { data: timelineData } = useConversationsTimeline({ ...dateFilters, granularity: 'day' });
  const { data: responseTime } = useResponseTime(dateFilters);
  const { data: conversationDuration } = useConversationDuration(dateFilters);
  const { data: channelsDistribution } = useChannelsDistribution(dateFilters);
  const { data: customerEngagement } = useCustomerEngagement(dateFilters);
  const { data: ordersSummary } = useOrdersSummary(dateFilters);
  const { data: appointmentsSummary } = useAppointmentsSummary(dateFilters);
  const { data: conversions } = useConversions(dateFilters);
  const { data: peakHours } = usePeakHours(dateFilters);
  const { data: aiPerformance } = useAIPerformance(dateFilters);

  // Transform data for charts
  const messagesByType = useMemo(() => {
    if (!messagesTotal?.bySenderType) return [];
    return [
      { name: 'Customer', value: messagesTotal.bySenderType.customer || 0 },
      { name: 'AI Agent', value: messagesTotal.bySenderType.ai_agent || 0 },
      { name: 'Admin', value: messagesTotal.bySenderType.admin || 0 },
    ].filter(item => item.value > 0);
  }, [messagesTotal]);

  const conversationsByStatus = useMemo(() => {
    if (!conversationsTotal) return [];
    return [
      { name: 'Active', value: conversationsTotal.active },
      { name: 'Ended', value: conversationsTotal.ended },
    ].filter(item => item.value > 0);
  }, [conversationsTotal]);

  const channelChartData = useMemo(() => {
    if (!channelsDistribution) return [];
    return channelsDistribution.map(channel => ({
      name: channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1).replace('_', ' '),
      value: channel.conversationCount,
    }));
  }, [channelsDistribution]);

  const ordersByStatus = useMemo(() => {
    if (!ordersSummary?.byStatus) return [];
    return [
      { name: 'Pending', value: ordersSummary.byStatus.pending || 0 },
      { name: 'Completed', value: ordersSummary.byStatus.completed || 0 },
      { name: 'Cancelled', value: ordersSummary.byStatus.cancelled || 0 },
    ].filter(item => item.value > 0);
  }, [ordersSummary]);

  const appointmentsByStatus = useMemo(() => {
    if (!appointmentsSummary?.byStatus) return [];
    return [
      { name: 'Scheduled', value: appointmentsSummary.byStatus.scheduled || 0 },
      { name: 'Completed', value: appointmentsSummary.byStatus.completed || 0 },
      { name: 'Cancelled', value: appointmentsSummary.byStatus.cancelled || 0 },
    ].filter(item => item.value > 0);
  }, [appointmentsSummary]);

  const peakHoursData = useMemo(() => {
    if (!peakHours) return [];
    return peakHours.map(hour => ({
      label: `${hour.hour}:00`,
      value: hour.messageCount,
    }));
  }, [peakHours]);

  const customerEngagementData = useMemo(() => {
    if (!customerEngagement) return [];
    return [
      { name: 'New Customers', value: customerEngagement.newCustomers },
      { name: 'Returning Customers', value: customerEngagement.returningCustomers },
    ].filter(item => item.value > 0);
  }, [customerEngagement]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
              <p className="text-muted-foreground">
                Comprehensive analytics and insights for your business
              </p>
            </div>
            <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="sales">Sales & Orders</TabsTrigger>
              <TabsTrigger value="ai">AI Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Conversations"
                  value={(conversationsTotal?.total ?? 0).toLocaleString()}
                  description={`${conversationsTotal?.active ?? 0} active, ${conversationsTotal?.ended ?? 0} ended`}
                  icon={MessageSquare}
                />
                <MetricCard
                  title="Total Messages"
                  value={(messagesTotal?.total ?? 0).toLocaleString()}
                  description="All messages across channels"
                  icon={Activity}
                />
                <MetricCard
                  title="Total Customers"
                  value={(customerEngagement?.totalCustomers ?? 0).toLocaleString()}
                  description={`${(customerEngagement?.returningCustomerRate ?? 0).toFixed(1)}% returning rate`}
                  icon={Users}
                />
                <MetricCard
                  title="Total Revenue"
                  value={formatCurrency(ordersSummary?.totalRevenue ?? 0)}
                  description={`${ordersSummary?.totalOrders ?? 0} orders`}
                  icon={ShoppingCart}
                />
              </div>

              {/* Timeline and Distribution */}
              <div className="grid gap-4 md:grid-cols-2">
                {timelineData && (
                  <ConversationsTimelineChart
                    data={timelineData}
                    title="Conversations Over Time"
                    description="Daily conversation activity"
                  />
                )}
                {conversationsByStatus.length > 0 && (
                  <DistributionDonutChart
                    data={conversationsByStatus}
                    title="Conversation Status"
                    description="Active vs ended conversations"
                    showTotal
                  />
                )}
              </div>

              {/* Channels and Messages */}
              <div className="grid gap-4 md:grid-cols-2">
                {channelChartData.length > 0 && (
                  <DistributionDonutChart
                    data={channelChartData}
                    title="Channel Distribution"
                    description="Conversations by channel"
                  />
                )}
                {messagesByType.length > 0 && (
                  <DistributionDonutChart
                    data={messagesByType}
                    title="Messages by Sender"
                    description="Distribution of message senders"
                    showTotal
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="conversations" className="space-y-4">
              {/* Conversation Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Avg Response Time"
                  value={responseTime?.averageSeconds != null ? formatTime(responseTime.averageSeconds) : '0s'}
                  description={`Median: ${responseTime?.medianSeconds != null ? formatTime(responseTime.medianSeconds) : '0s'}`}
                  icon={Clock}
                />
                <MetricCard
                  title="Avg Duration"
                  value={conversationDuration?.averageMinutes != null ? `${conversationDuration.averageMinutes.toFixed(1)}m` : '0m'}
                  description={`Median: ${conversationDuration?.medianMinutes != null ? conversationDuration.medianMinutes.toFixed(1) : 0}m`}
                  icon={Clock}
                />
                <MetricCard
                  title="Active Conversations"
                  value={(conversationsTotal?.active ?? 0).toLocaleString()}
                  icon={MessageSquare}
                />
                <MetricCard
                  title="Ended Conversations"
                  value={(conversationsTotal?.ended ?? 0).toLocaleString()}
                  icon={MessageSquare}
                />
              </div>

              {/* Timeline and Peak Hours */}
              <div className="grid gap-4 md:grid-cols-2">
                {timelineData && (
                  <ConversationsTimelineChart
                    data={timelineData}
                    title="Conversation Timeline"
                    description="Conversation activity over time"
                  />
                )}
                {peakHoursData.length > 0 && (
                  <HorizontalBarChart
                    data={peakHoursData}
                    title="Peak Activity Hours"
                    description="Messages by hour of day"
                  />
                )}
              </div>

              {/* Channel Distribution */}
              {channelChartData.length > 0 && (
                <DistributionDonutChart
                  data={channelChartData}
                  title="Channel Distribution"
                  description="Conversations across different channels"
                />
              )}
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              {/* Customer Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Customers"
                  value={(customerEngagement?.totalCustomers ?? 0).toLocaleString()}
                  icon={Users}
                />
                <MetricCard
                  title="New Customers"
                  value={(customerEngagement?.newCustomers ?? 0).toLocaleString()}
                  icon={Users}
                />
                <MetricCard
                  title="Returning Customers"
                  value={(customerEngagement?.returningCustomers ?? 0).toLocaleString()}
                  icon={Users}
                />
                <MetricCard
                  title="Returning Rate"
                  value={`${(customerEngagement?.returningCustomerRate ?? 0).toFixed(1)}%`}
                  icon={TrendingUp}
                />
              </div>

              {/* Customer Engagement Chart */}
              {customerEngagementData.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <DistributionDonutChart
                    data={customerEngagementData}
                    title="Customer Type Distribution"
                    description="New vs returning customers"
                    showTotal
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              {/* Sales Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Revenue"
                  value={formatCurrency(ordersSummary?.totalRevenue ?? 0)}
                  icon={ShoppingCart}
                />
                <MetricCard
                  title="Total Orders"
                  value={(ordersSummary?.totalOrders ?? 0).toLocaleString()}
                  description={`${ordersSummary?.aiGeneratedOrders ?? 0} AI-generated`}
                  icon={ShoppingCart}
                />
                <MetricCard
                  title="Avg Order Value"
                  value={formatCurrency(ordersSummary?.averageOrderValue ?? 0)}
                  icon={TrendingUp}
                />
                <MetricCard
                  title="Total Appointments"
                  value={(appointmentsSummary?.totalAppointments ?? 0).toLocaleString()}
                  description={`${appointmentsSummary?.aiGeneratedAppointments ?? 0} AI-generated`}
                  icon={Calendar}
                />
              </div>

              {/* Orders and Appointments */}
              <div className="grid gap-4 md:grid-cols-3">
                {ordersByStatus.length > 0 && (
                  <DistributionDonutChart
                    data={ordersByStatus}
                    title="Orders by Status"
                    description="Order status distribution"
                    showTotal
                  />
                )}
                {appointmentsByStatus.length > 0 && (
                  <DistributionDonutChart
                    data={appointmentsByStatus}
                    title="Appointments by Status"
                    description="Appointment status distribution"
                    showTotal
                  />
                )}
                {conversions && (
                  <div className="space-y-4">
                    <MetricCard
                      title="Conversion Rate"
                      value={`${conversions.conversationToOrder.toFixed(1)}%`}
                      description="Conversations to orders"
                      icon={TrendingUp}
                    />
                    <MetricCard
                      title="Booking Rate"
                      value={`${conversions.conversationToAppointment.toFixed(1)}%`}
                      description="Conversations to appointments"
                      icon={Calendar}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              {/* AI Performance Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Messages"
                  value={(aiPerformance?.totalMessages ?? 0).toLocaleString()}
                  icon={Bot}
                />
                <MetricCard
                  title="AI Handled Messages"
                  value={(aiPerformance?.aiHandledMessages ?? 0).toLocaleString()}
                  icon={Bot}
                />
                <MetricCard
                  title="Admin Handled Messages"
                  value={(aiPerformance?.adminHandledMessages ?? 0).toLocaleString()}
                  icon={Users}
                />
                <MetricCard
                  title="AI Handled Percentage"
                  value={`${(aiPerformance?.aiHandledPercentage ?? 0).toFixed(1)}%`}
                  description="Messages handled by AI"
                  icon={TrendingUp}
                />
              </div>

              {/* AI Performance Chart */}
              {aiPerformance && (
                <DistributionDonutChart
                  data={[
                    { name: 'AI Handled', value: aiPerformance.aiHandledMessages },
                    { name: 'Admin Handled', value: aiPerformance.adminHandledMessages },
                  ].filter(item => item.value > 0)}
                  title="Message Handling Distribution"
                  description="AI vs Admin message handling"
                  showTotal
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
