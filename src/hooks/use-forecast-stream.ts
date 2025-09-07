'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ProgressData {
  progress: number;
  message?: string;
}

export interface ForecastDataPoint {
  date: string;
  actual?: number;
  forecast: number;
  lower_bound?: number;
  upper_bound?: number;
}

interface UpdateData {
  metrics?: Record<string, number>;
  forecastData?: ForecastDataPoint[];
  message?: string;
}

interface CompleteData {
  forecastId: string;
  metrics: Record<string, number>;
  timestamp: string;
}

interface ErrorData {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

type StreamEvent = 
  | { type: 'progress'; data: ProgressData }
  | { type: 'update'; data: UpdateData }
  | { type: 'complete'; data: CompleteData }
  | { type: 'error'; data: ErrorData };

interface CustomSession {
  accessToken: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function useForecastStream(jobId: string) {
  const { data: session } = useSession() as { data: CustomSession | null };
  const [event, setEvent] = useState<StreamEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session?.accessToken || !jobId) return;

    const url = new URL(`/forecasts/${jobId}/stream`, process.env.NEXT_PUBLIC_API_URL);
    const eventSource = new EventSource(url.toString());

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = (e) => {
      console.error('SSE Error:', e);
      setError(new Error('Connection failed'));
      eventSource.close();
    };

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setEvent(data);
        if (data.type === 'complete' || data.type === 'error') {
          eventSource.close();
          setIsConnected(false);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [jobId, session?.accessToken]);

  return { event, isConnected, error };
}
