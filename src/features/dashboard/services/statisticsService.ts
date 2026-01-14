import type {
  ConversationStatistics,
  ResponseTimeStatistics,
  MessageStatistics,
  StatisticsQueryParams,
} from '../types/statistics.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const STATISTICS_PREFIX = '/api/statistics';

const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

const buildQueryString = (params: StatisticsQueryParams): string => {
  const queryParams = new URLSearchParams();

  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.channel) queryParams.append('channel', params.channel);
  if (params.status) queryParams.append('status', params.status);
  if (params.senderType) queryParams.append('senderType', params.senderType);
  if (params.messageType) queryParams.append('messageType', params.messageType);

  return queryParams.toString();
};

export const statisticsService = {
  async getConversationStats(
    params: StatisticsQueryParams = {}
  ): Promise<ConversationStatistics> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${STATISTICS_PREFIX}/conversations/total${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      ...fetchOptions,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch conversation statistics');
    }

    return response.json();
  },

  async getResponseTimeStats(
    params: Pick<StatisticsQueryParams, 'startDate' | 'endDate'> = {}
  ): Promise<ResponseTimeStatistics> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${STATISTICS_PREFIX}/messages/response-time${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      ...fetchOptions,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch response time statistics');
    }

    return response.json();
  },

  async getMessageStats(
    params: StatisticsQueryParams = {}
  ): Promise<MessageStatistics> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${STATISTICS_PREFIX}/messages/total${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      ...fetchOptions,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch message statistics');
    }

    return response.json();
  },
};
