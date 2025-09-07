import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { ForecastChart } from '@/components/charts/forecast-chart';
import { MetricsCards } from '@/components/metrics/metrics-cards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ForecastData {
  job_id: string;
  status: string;
  metrics: {
    rmse: number;
    mape: number;
    forecast_period: number;
    confidence: number;
  };
  forecast: Array<{
    date: string;
    actual?: number;
    forecast: number;
    lower_bound?: number;
    upper_bound?: number;
  }>;
}

export default async function ForecastPage({ params }: { params: { jobId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  let forecastData: ForecastData;
  try {
    const res = await fetch(`${API_BASE_URL}/forecasts/${params.jobId}`, {
      headers: { 'Authorization': `Bearer ${session.accessToken}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch forecast');
    forecastData = await res.json();
  } catch (error) {
    console.error('Error:', error);
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Forecast Results</h1>
        <p className="text-muted-foreground">Job ID: {params.jobId}</p>
      </div>

      <MetricsCards metrics={forecastData.metrics} />

      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast">
          <ForecastChart data={forecastData.forecast} height={500} />
        </TabsContent>

        <TabsContent value="data">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-right">Actual</th>
                    <th className="p-4 text-right">Forecast</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.forecast.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="p-4">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="p-4 text-right">{row.actual?.toFixed(2) || '-'}</td>
                      <td className="p-4 text-right">{row.forecast.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
