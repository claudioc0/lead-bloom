import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMessagesQuery, filterMessagesByStatus } from './useMessages';
import type { MessageWithLead } from './useMessages';
import type { Status } from '@/data/lead.types';

// Mock mappers to pass through unharmed
vi.mock('@/lib/lead-mappers', () => ({
  dbToLead: vi.fn((x) => x),
  toneFromDb: vi.fn((x) => x),
  goalFromDb: vi.fn((x) => x),
}));

const mockBuilder = {
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  then: vi.fn(),
};

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockBuilder),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMessages coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMessagesQuery', () => {
    it('throws on database error', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({ data: null, error: new Error('Failed to fetch data') }));
      
      const { result } = renderHook(() => useMessagesQuery(), { wrapper: createWrapper() });
      
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('Failed to fetch data');
    });

    it('handles uncovered branch on line 25 (leadRow is null or array)', async () => {
      // data has rows with leads: null and leads: [] to cover the specific branch checks
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({
        data: [
          { id: '1', body: 'msg1', tone: 'casual', goal: 'sales', created_at: '2023-01-01', leads: null },
          { id: '2', body: 'msg2', tone: 'casual', goal: 'sales', created_at: '2023-01-02', leads: [{ id: 'lead1' }] }
        ],
        error: null
      }));
      
      const { result } = renderHook(() => useMessagesQuery(), { wrapper: createWrapper() });
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // The flatMap logic should skip rows where leads is null or an array, returning an empty array.
      expect(result.current.data).toEqual([]);
    });
    
    it('maps valid lead row correctly', async () => {
      mockBuilder.then.mockImplementationOnce((resolve) => resolve({
        data: [
          { id: '1', body: 'msg1', tone: 'casual', goal: 'sales', created_at: '2023-01-01', leads: { id: 'lead1', status: 'new' } }
        ],
        error: null
      }));
      
      const { result } = renderHook(() => useMessagesQuery(), { wrapper: createWrapper() });
      
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data![0].id).toBe('1');
    });
  });

  describe('filterMessagesByStatus', () => {
    const mockMessages = [
      { id: '1', lead: { status: 'new' } },
      { id: '2', lead: { status: 'Contacted' } },
    ] as unknown as MessageWithLead[];

    it('returns all messages when filter is "All"', () => {
      expect(filterMessagesByStatus(mockMessages, 'All')).toHaveLength(2);
    });

    it('filters by specific status', () => {
      expect(filterMessagesByStatus(mockMessages, 'new' as Status)).toHaveLength(1);
      expect(filterMessagesByStatus(mockMessages, 'new' as Status)[0].id).toBe('1');
    });
  });
});