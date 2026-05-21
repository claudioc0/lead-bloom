import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLeadsQuery, useLeadMutations, useSearchLeads, useGenerateMessage } from './useLeads';
import { supabase } from '@/lib/supabase';

// Mock mapping utilities to pass through data unharmed
vi.mock('@/lib/lead-mappers', () => ({
  dbToLead: vi.fn((x) => x),
  statusToDb: vi.fn((x) => x),
}));

// Mock Supabase chainable query builder
const mockBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  then: vi.fn(),
};

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockBuilder),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLeads coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useLeadsQuery', () => {
    it('exercises filter combinations (savedOnly, limit, orderBy) to cover branching logic', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({ data: [{ id: 1 }], error: null }));
      const { result } = renderHook(() => useLeadsQuery({ savedOnly: true, limit: 10, orderBy: 'fit_score' }), { wrapper: createWrapper() });
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      expect(mockBuilder.eq).toHaveBeenCalledWith('is_saved', true);
      expect(mockBuilder.order).toHaveBeenCalledWith('fit_score', { ascending: false });
      expect(mockBuilder.limit).toHaveBeenCalledWith(10);
    });
  });

  describe('useLeadMutations (lines 23-78 uncovered branches)', () => {
    it('saveLead mutation throws on error', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({ error: new Error('saveLead error') }));
      const { result } = renderHook(() => useLeadMutations(), { wrapper: createWrapper() });
      result.current.saveLead.mutate('1');
      await waitFor(() => expect(result.current.saveLead.isError).toBe(true));
    });

    it('setStatus mutation throws on error', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({ error: new Error('setStatus error') }));
      const { result } = renderHook(() => useLeadMutations(), { wrapper: createWrapper() });
      result.current.setStatus.mutate({ id: '1', status: 'Contacted' as any });
      await waitFor(() => expect(result.current.setStatus.isError).toBe(true));
    });

    it('setNote mutation throws on error', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({ error: new Error('setNote error') }));
      const { result } = renderHook(() => useLeadMutations(), { wrapper: createWrapper() });
      result.current.setNote.mutate({ id: '1', note: 'test' });
      await waitFor(() => expect(result.current.setNote.isError).toBe(true));
    });

    it('removeFromBoard mutation throws on error', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({ error: new Error('removeFromBoard error') }));
      const { result } = renderHook(() => useLeadMutations(), { wrapper: createWrapper() });
      result.current.removeFromBoard.mutate('1');
      await waitFor(() => expect(result.current.removeFromBoard.isError).toBe(true));
    });

    it('deleteLead mutation throws on error', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({ error: new Error('deleteLead error') }));
      const { result } = renderHook(() => useLeadMutations(), { wrapper: createWrapper() });
      result.current.deleteLead.mutate('1');
      await waitFor(() => expect(result.current.deleteLead.isError).toBe(true));
    });
  });

  describe('useSearchLeads errors', () => {
    it('handles Error state when the Edge Function returns 401 (unauthorized)', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({ error: new Error('401 Unauthorized') });
      const { result } = renderHook(() => useSearchLeads(), { wrapper: createWrapper() });
      result.current.mutate({ niche: 'Gaming', subMin: 0, subMax: 100, frequency: 'Weekly', language: 'en', country: 'US' });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toContain('401');
    });

    it('handles Error state when monthlyUsage >= planLimit blocks search (Edge Function returns limit error)', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({ data: { error: 'monthly limit reached' }, error: null });
      const { result } = renderHook(() => useSearchLeads(), { wrapper: createWrapper() });
      result.current.mutate({ niche: 'Gaming', subMin: 0, subMax: 100, frequency: 'Weekly', language: 'en', country: 'US' });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toContain('limit');
    });

    it('handles Error state on network failure (fetch throws)', async () => {
      (supabase.functions.invoke as any).mockRejectedValueOnce(new Error('Network failure'));
      const { result } = renderHook(() => useSearchLeads(), { wrapper: createWrapper() });
      result.current.mutate({ niche: 'Gaming', subMin: 0, subMax: 100, frequency: 'Weekly', language: 'en', country: 'US' });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toContain('Network failure');
    });
  });

  describe('useGenerateMessage (line 130 branch)', () => {
    it('throws on data.error resulting in an edge function rejection', async () => {
      (supabase.functions.invoke as any).mockResolvedValueOnce({ data: { error: 'Generation failed' }, error: null });
      const { result } = renderHook(() => useGenerateMessage(), { wrapper: createWrapper() });
      result.current.mutate({ leadId: '1', tone: 'professional', goal: 'outreach' });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('Generation failed');
    });
  });
});