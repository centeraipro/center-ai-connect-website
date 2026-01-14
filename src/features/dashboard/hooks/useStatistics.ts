import { useState, useEffect, useCallback } from 'react';
import { statisticsService } from '../services/statisticsService';
import type {
  ConversationStatistics,
  ResponseTimeStatistics,
  MessageStatistics,
  StatisticsQueryParams,
  DashboardStatistics,
} from '../types/statistics.types';

export function useStatistics(params: StatisticsQueryParams = {}) {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [conversations, responseTime, messages] = await Promise.all([
        statisticsService.getConversationStats(params),
        statisticsService.getResponseTimeStats(params),
        statisticsService.getMessageStats(params),
      ]);

      setStatistics({
        conversations,
        responseTime,
        messages,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(message);
      console.error('Statistics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const refresh = () => {
    fetchStatistics();
  };

  return {
    statistics,
    isLoading,
    error,
    refresh,
  };
}

export function useConversationStatistics(params: StatisticsQueryParams = {}) {
  const [data, setData] = useState<ConversationStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await statisticsService.getConversationStats(params);
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch conversation statistics';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  };
}

export function useResponseTimeStatistics(
  params: Pick<StatisticsQueryParams, 'startDate' | 'endDate'> = {}
) {
  const [data, setData] = useState<ResponseTimeStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await statisticsService.getResponseTimeStats(params);
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch response time statistics';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  };
}

export function useMessageStatistics(params: StatisticsQueryParams = {}) {
  const [data, setData] = useState<MessageStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await statisticsService.getMessageStats(params);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch message statistics';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  };
}
