import { ForecastResult } from '@/types/forecast';

export const uploadForecastFile = async (file: File): Promise<ForecastResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/v1/forecast', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload forecast file');
  }

  return response.json();
};

export const getSampleForecast = async (industry?: string): Promise<ForecastResult> => {
  const response = await fetch('/api/v1/forecasts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // You'll need to adjust this to match your ForecastJobCreate schema
      dataset_id: 'sample-dataset-id', // You need a sample dataset ID
      parameters: {
        industry,
        // Add other required parameters
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create sample forecast');
  }

  const result = await response.json();
  // You might need to poll the job status using the returned job_id
  return result;
};

export const getForecastJobStatus = async (jobId: string): Promise<ForecastResult> => {
  const response = await fetch(`/api/v1/forecast/${jobId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get forecast status');
  }

  return response.json();
};
