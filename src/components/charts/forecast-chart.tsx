'use client';

import { useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card } from '@/components/ui/card';

interface ForecastDataPoint {
  date: string;
  actual?: number;
  forecast: number;
  lower_bound?: number;
  upper_bound?: number;
}

interface ForecastChartProps {
  data: ForecastDataPoint[];
  height?: number;
  showConfidenceBand?: boolean;
}

export function ForecastChart({ 
  data, 
  height = 400,
  showConfidenceBand = true 
}: ForecastChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(),
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No forecast data available
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis 
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <Tooltip 
              formatter={(value) => [value, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            
            {showConfidenceBand && (
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            )}

            {showConfidenceBand && 'lower_bound' in data[0] && 'upper_bound' in data[0] && (
              <Area
                type="monotone"
                dataKey="upper_bound"
                stroke="#8884d8"
                fillOpacity={0.1}
                fill="url(#colorUv)"
                name="Confidence Interval"
              />
            )}

            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              name="Forecast"
            />

            {'actual' in data[0] && (
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                name="Actual"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
