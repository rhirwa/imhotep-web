"use client";
import { useState, useRef, useCallback } from "react";
import { 
  Upload, 
  FileText, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  Cpu,
  BarChart3,
  Download,
  Eye,
  Users,
  Calendar
} from "lucide-react";

interface ForecastResult {
  summary: {
    total_rows: number;
    columns_detected: string[];
    missing_values: number;
    anomalies_detected: number;
    date_range: string;
  };
  forecasts: Array<{
    sku: string;
    current_stock: number;
    predicted_demand: number;
    risk_level: 'low' | 'medium' | 'high';
    recommendation: string;
    potential_revenue_impact: number;
  }>;
  insights: Array<{
    type: 'stockout' | 'overstock' | 'opportunity';
    message: string;
    priority: 'low' | 'medium' | 'high';
    sku?: string;
  }>;
  methodology_notes: string[];
}

export default function ForecastingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'summary' | 'charts' | 'insights'>('summary');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/v1/forecast", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to process forecast');
      }
      
      const data = await res.json();
      setResult(data);
      setActiveView('summary');
    } catch (err) {
      console.error("Forecast error:", err);
    } finally {
      setLoading(false);
    }
  };

  const useSampleData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/demand-forecast/sample", {
        method: "POST",
      });
      const data = await res.json();
      setResult(data);
      setFile(null);
      setActiveView('summary');
    } catch (err) {
      console.error("Sample data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'stockout': return <TrendingDown className="w-4 h-4" />;
      case 'overstock': return <TrendingUp className="w-4 h-4" />;
      case 'opportunity': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-sm flex items-center justify-center">
                <span className="text-black font-bold text-sm">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-mono">Imhotep Systems</h1>
                <p className="text-xs text-gray-400">Intelligence Stack</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">CPU Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-green-600/10 border border-green-600/20 rounded-lg px-4 py-2 mb-8">
            <Cpu className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-mono font-medium">DEMAND FORECASTING STACK</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-mono leading-tight">
            See Your <span className="text-green-400">Data</span>,<br />
            Predict Your <span className="text-yellow-400">Needs</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Messy sales data? Multiple SKUs? We detect, clean, and predict—so you don&apos;t have to.
            <br />
            <span className="text-cyan-400 font-mono">Upload once, intelligence forever.</span>
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="container mx-auto px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <Upload className="w-6 h-6 mr-3 text-green-400" />
              <h2 className="text-2xl font-bold font-mono">Data Intelligence Portal</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    dragOver 
                      ? 'border-green-400 bg-green-400/5' 
                      : 'border-gray-600 hover:border-green-400/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-semibold mb-2 font-mono">
                    {file ? file.name : 'Upload Your Sales Data'}
                  </h3>
                  <p className="text-gray-400 mb-4 font-mono text-sm">
                    CSV files • Drag & drop or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-mono font-medium transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Run Forecast Analysis
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <span className="text-gray-500 font-mono">or</span>
                  </div>

                  <button
                    onClick={useSampleData}
                    disabled={loading}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-mono font-medium transition-colors flex items-center justify-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Use Sample Dataset
                  </button>
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 font-mono text-green-400">What We Detect</h3>
                  <ul className="space-y-3 text-sm font-mono">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                      SKU columns & product identifiers
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                      Date patterns & sales volumes
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                      Missing data & anomalies
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                      Seasonal trends & patterns
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 font-mono text-yellow-400">Intelligence Output</h3>
                  <ul className="space-y-3 text-sm font-mono">
                    <li className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-3 text-yellow-400" />
                      SKU-level demand forecasts
                    </li>
                    <li className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-3 text-yellow-400" />
                      Stockout & overstock alerts
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-3 text-yellow-400" />
                      Revenue impact analysis
                    </li>
                    <li className="flex items-center">
                      <Users className="w-4 h-4 mr-3 text-yellow-400" />
                      Actionable recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="container mx-auto px-6 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-mono text-green-400">
                  Intelligence Report Generated
                </h2>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-mono transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-mono transition-colors">
                    <Users className="w-4 h-4" />
                    <span>Engage Imhotep</span>
                  </button>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
                {[
                  { key: 'summary', label: 'Summary', icon: FileText },
                  { key: 'charts', label: 'Forecasts', icon: BarChart3 },
                  { key: 'insights', label: 'Insights', icon: Eye },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveView(key as "summary" | "charts" | "insights")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-mono transition-colors ${
                      activeView === key
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Summary View */}
              {activeView === 'summary' && (
                <div className="space-y-8">
                  {/* Data Summary */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-2xl font-bold text-green-400 font-mono">
                        {result.summary.total_rows.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Total Records</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-2xl font-bold text-yellow-400 font-mono">
                        {result.summary.columns_detected.length}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Columns Detected</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-2xl font-bold text-red-400 font-mono">
                        {result.summary.anomalies_detected}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Anomalies Found</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <div className="text-2xl font-bold text-cyan-400 font-mono">
                        {result.forecasts.length}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">SKUs Analyzed</div>
                    </div>
                  </div>

                  {/* Methodology Notes */}
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 font-mono text-green-400">
                      Intelligence Processing Notes
                    </h3>
                    <ul className="space-y-2">
                      {result.methodology_notes.map((note, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm font-mono">
                          <CheckCircle className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Forecasts View */}
              {activeView === 'charts' && (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    {result.forecasts.slice(0, 6).map((forecast, index) => (
                      <div key={index} className="bg-gray-800/30 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold font-mono">{forecast.sku}</h3>
                            <p className="text-sm text-gray-400">Current Stock: {forecast.current_stock}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-mono border ${getRiskColor(forecast.risk_level)}`}>
                            {forecast.risk_level.toUpperCase()} RISK
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-green-400 font-mono">
                              {forecast.predicted_demand}
                            </div>
                            <div className="text-xs text-gray-400">Predicted Demand</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-yellow-400 font-mono">
                              ${forecast.potential_revenue_impact.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">Revenue Impact</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-cyan-400 font-mono">
                              {forecast.recommendation}
                            </div>
                            <div className="text-xs text-gray-400">Recommendation</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights View */}
              {activeView === 'insights' && (
                <div className="space-y-6">
                  {/* Problem vs Solution Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 font-mono text-red-400">
                        What We See In Your Data
                      </h3>
                      <div className="space-y-4">
                        {result.insights.filter(i => i.priority === 'high').map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                            {getInsightIcon(insight.type)}
                            <div>
                              <div className="text-sm font-mono text-red-300">{insight.message}</div>
                              {insight.sku && (
                                <div className="text-xs text-red-400 mt-1">SKU: {insight.sku}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 font-mono text-green-400">
                        How We Solve It
                      </h3>
                      <div className="space-y-4">
                        {result.forecasts.filter(f => f.risk_level === 'high').slice(0, 3).map((forecast, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-400" />
                            <div>
                              <div className="text-sm font-mono text-green-300">
                                {forecast.recommendation}
                              </div>
                              <div className="text-xs text-green-400 mt-1">
                                Potential impact: ${forecast.potential_revenue_impact.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* All Insights */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 font-mono">All Intelligence Alerts</h3>
                    <div className="space-y-3">
                      {result.insights.map((insight, index) => {
                        const priorityColors = {
                          high: 'border-red-500/30 bg-red-900/10',
                          medium: 'border-yellow-500/30 bg-yellow-900/10',
                          low: 'border-green-500/30 bg-green-900/10'
                        };
                        
                        return (
                          <div key={index} className={`flex items-center space-x-3 border rounded-lg p-3 ${priorityColors[insight.priority]}`}>
                            {getInsightIcon(insight.type)}
                            <div className="flex-1">
                              <span className="text-sm font-mono">{insight.message}</span>
                              {insight.sku && (
                                <span className="text-xs text-gray-400 ml-2">({insight.sku})</span>
                              )}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-mono ${
                              insight.priority === 'high' ? 'bg-red-600' :
                              insight.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                            }`}>
                              {insight.priority.toUpperCase()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Upsell Section */}
      {result && (
        <section className="container mx-auto px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-600/20 via-yellow-600/20 to-cyan-600/20 border border-green-600/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 font-mono">
                Ready for Continuous Intelligence?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                This preview shows what Imhotep can do with a single upload. 
                Imagine real-time forecasting, multi-store dashboards, custom alerts, 
                and dedicated analyst support for your entire business.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-green-400" />
                  <h3 className="font-semibold mb-2 font-mono">Continuous Updates</h3>
                  <p className="text-sm text-gray-400">Daily forecast refreshes</p>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                  <h3 className="font-semibold mb-2 font-mono">Multi-Store Dashboards</h3>
                  <p className="text-sm text-gray-400">Centralized intelligence</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                  <h3 className="font-semibold mb-2 font-mono">Dedicated Support</h3>
                  <p className="text-sm text-gray-400">Expert analyst check-ins</p>
                </div>
              </div>
              
              <div className="space-x-4">
                <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-mono font-medium transition-colors">
                  Engage Imhotep Systems
                </button>
                <button className="border border-gray-600 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-mono font-medium transition-colors">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-gray-400 font-mono text-sm">
              Imhotep Systems — The CPU behind African business intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}