import axios from 'axios';
import type {
  ConversationsTotalFilters,
  ConversationsTotalResponse,
  MessagesTotalFilters,
  MessagesTotalResponse,
  ConversationsTimelineFilters,
  ConversationsTimelineResponse,
  ResponseTimeFilters,
  ResponseTimeResponse,
  ConversationDurationFilters,
  ConversationDurationResponse,
  ChannelsDistributionFilters,
  ChannelsDistributionResponse,
  CustomerEngagementFilters,
  CustomerEngagementResponse,
  OrdersSummaryFilters,
  OrdersSummaryResponse,
  AppointmentsSummaryFilters,
  AppointmentsSummaryResponse,
  ConversionsFilters,
  ConversionsResponse,
  PeakHoursFilters,
  PeakHoursResponse,
  AIPerformanceFilters,
  AIPerformanceResponse,
} from '../types/statistics.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const STATISTICS_PREFIX = '/api/statistics';

const axiosConfig = {
  withCredentials: true,
};

export const statisticsService = {
  async getConversationsTotal(filters?: ConversationsTotalFilters): Promise<ConversationsTotalResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/conversations/total`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getMessagesTotal(filters?: MessagesTotalFilters): Promise<MessagesTotalResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/messages/total`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getConversationsTimeline(filters: ConversationsTimelineFilters): Promise<ConversationsTimelineResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/conversations/timeline`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getResponseTime(filters?: ResponseTimeFilters): Promise<ResponseTimeResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/messages/response-time`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getConversationDuration(filters?: ConversationDurationFilters): Promise<ConversationDurationResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/conversations/duration`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getChannelsDistribution(filters?: ChannelsDistributionFilters): Promise<ChannelsDistributionResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/channels/distribution`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getCustomerEngagement(filters?: CustomerEngagementFilters): Promise<CustomerEngagementResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/customers/engagement`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getOrdersSummary(filters?: OrdersSummaryFilters): Promise<OrdersSummaryResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/orders/summary`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getAppointmentsSummary(filters?: AppointmentsSummaryFilters): Promise<AppointmentsSummaryResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/appointments/summary`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getConversions(filters?: ConversionsFilters): Promise<ConversionsResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/conversions`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getPeakHours(filters?: PeakHoursFilters): Promise<PeakHoursResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/activity/peak-hours`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },

  async getAIPerformance(filters?: AIPerformanceFilters): Promise<AIPerformanceResponse> {
    const response = await axios.get(`${API_BASE_URL}${STATISTICS_PREFIX}/ai/performance`, {
      ...axiosConfig,
      params: filters,
    });
    return response.data;
  },
};
