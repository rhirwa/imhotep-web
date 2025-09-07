import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

type TrendType = 'up' | 'down' | 'neutral';

interface MetricsData {
  rmse?: number;
  mape?: number;
  forecast_period?: number;
  confidence?: number;
  rmse_trend?: TrendType;
  mape_trend?: TrendType;
  rmse_trend_value?: string;
  mape_trend_value?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: keyof typeof Icons;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
}: MetricCardProps) {
  const Icon = icon ? Icons[icon] : null;
  
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400',
  };

  const trendIcons = {
    up: 'trendingUp',
    down: 'trendingDown',
    neutral: 'trendingFlat',
  } as const;

  const TrendIcon = trend ? Icons[trendIcons[trend]] : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && TrendIcon && trendValue && (
          <div className={`flex items-center text-xs mt-1 ${trendColors[trend]}`}>
            <TrendIcon className="h-3 w-3 mr-1" />
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricsCardsProps {
  metrics: MetricsData;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="RMSE"
        value={metrics.rmse?.toFixed(2) || 'N/A'}
        description="Root Mean Square Error"
        icon="barChart"
        trend={metrics.rmse_trend}
        trendValue={metrics.rmse_trend_value}
      />
      <MetricCard
        title="MAPE"
        value={metrics.mape ? `${metrics.mape.toFixed(2)}%` : 'N/A'}
        description="Mean Absolute Percentage Error"
        icon="lineChart"
        trend={metrics.mape_trend}
        trendValue={metrics.mape_trend_value}
      />
      <MetricCard
        title="Forecast Period"
        value={metrics.forecast_period || 'N/A'}
        description="Days forecasted"
        icon="calendar"
      />
      <MetricCard
        title="Confidence"
        value={metrics.confidence ? `${metrics.confidence}%` : 'N/A'}
        description="Model confidence"
        icon="gauge"
      />
    </div>
  );
}
