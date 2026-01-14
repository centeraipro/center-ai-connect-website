import { useQuery } from '@tanstack/react-query';
import { configurationService } from '../services/configurationService';

export function useBusiness(slug: string) {
  return useQuery({
    queryKey: ['business', slug],
    queryFn: () => configurationService.getBusiness(slug),
    enabled: !!slug,
  });
}

export function useQRCode(slug: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ['qr-code', slug],
    queryFn: () => configurationService.getQRCode(slug),
    enabled: !!slug && enabled,
    refetchInterval: false, // No automatic polling
  });
}

export function useConnectionStatus(slug: string, shouldPoll: boolean = false) {
  return useQuery({
    queryKey: ['connection-status', slug],
    queryFn: () => configurationService.getConnectionStatus(slug),
    enabled: !!slug,
    refetchInterval: shouldPoll ? 3000 : false, // Only poll when explicitly requested
  });
}
