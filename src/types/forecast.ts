export interface ForecastSummary {
  total_rows: number;
  columns_detected: string[];
  missing_values: number;
  anomalies_detected: number;
  date_range: string;
}

export interface ForecastItem {
  sku: string;
  current_stock: number;
  predicted_demand: number;
  risk_level: 'low' | 'medium' | 'high';
  recommendation: string;
  potential_revenue_impact: number;
}

export interface ForecastInsight {
  type: 'stockout' | 'overstock' | 'opportunity' | 'trend' | 'anomaly';
  message: string;
  priority: 'low' | 'medium' | 'high';
  sku?: string;
  impact?: string;
  date?: string;
}

export interface ForecastResult {
  job_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary: ForecastSummary;
  forecasts: ForecastItem[];
  insights: ForecastInsight[];
  methodology_notes: string[];
  generated_at?: string;
  error?: string;
}

export interface ForecastJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  result?: ForecastResult;
  error?: string;
}
