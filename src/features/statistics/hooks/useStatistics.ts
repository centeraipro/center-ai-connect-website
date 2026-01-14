import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '../services/statisticsService';
import type {
  ConversationsTotalFilters,
  MessagesTotalFilters,
  ConversationsTimelineFilters,
  ResponseTimeFilters,
  ConversationDurationFilters,
  ChannelsDistributionFilters,
  CustomerEngagementFilters,
  OrdersSummaryFilters,
  AppointmentsSummaryFilters,
  ConversionsFilters,
  PeakHoursFilters,
  AIPerformanceFilters,
} from '../types/statistics.types';

export const useConversationsTotal = (filters?: ConversationsTotalFilters) => {
  return useQuery({
    queryKey: ['statistics', 'conversations', 'total', filters],
    queryFn: () => statisticsService.getConversationsTotal(filters),
  });
};

export const useMessagesTotal = (filters?: MessagesTotalFilters) => {
  return useQuery({
    queryKey: ['statistics', 'messages', 'total', filters],
    queryFn: () => statisticsService.getMessagesTotal(filters),
  });
};

export const useConversationsTimeline = (filters: ConversationsTimelineFilters) => {
  return useQuery({
    queryKey: ['statistics', 'conversations', 'timeline', filters],
    queryFn: () => statisticsService.getConversationsTimeline(filters),
  });
};

export const useResponseTime = (filters?: ResponseTimeFilters) => {
  return useQuery({
    queryKey: ['statistics', 'response-time', filters],
    queryFn: () => statisticsService.getResponseTime(filters),
  });
};

export const useConversationDuration = (filters?: ConversationDurationFilters) => {
  return useQuery({
    queryKey: ['statistics', 'conversation-duration', filters],
    queryFn: () => statisticsService.getConversationDuration(filters),
  });
};

export const useChannelsDistribution = (filters?: ChannelsDistributionFilters) => {
  return useQuery({
    queryKey: ['statistics', 'channels', 'distribution', filters],
    queryFn: () => statisticsService.getChannelsDistribution(filters),
  });
};

export const useCustomerEngagement = (filters?: CustomerEngagementFilters) => {
  return useQuery({
    queryKey: ['statistics', 'customers', 'engagement', filters],
    queryFn: () => statisticsService.getCustomerEngagement(filters),
  });
};

export const useOrdersSummary = (filters?: OrdersSummaryFilters) => {
  return useQuery({
    queryKey: ['statistics', 'orders', 'summary', filters],
    queryFn: () => statisticsService.getOrdersSummary(filters),
  });
};

export const useAppointmentsSummary = (filters?: AppointmentsSummaryFilters) => {
  return useQuery({
    queryKey: ['statistics', 'appointments', 'summary', filters],
    queryFn: () => statisticsService.getAppointmentsSummary(filters),
  });
};

export const useConversions = (filters?: ConversionsFilters) => {
  return useQuery({
    queryKey: ['statistics', 'conversions', filters],
    queryFn: () => statisticsService.getConversions(filters),
  });
};

export const usePeakHours = (filters?: PeakHoursFilters) => {
  return useQuery({
    queryKey: ['statistics', 'peak-hours', filters],
    queryFn: () => statisticsService.getPeakHours(filters),
  });
};

export const useAIPerformance = (filters?: AIPerformanceFilters) => {
  return useQuery({
    queryKey: ['statistics', 'ai', 'performance', filters],
    queryFn: () => statisticsService.getAIPerformance(filters),
  });
};
