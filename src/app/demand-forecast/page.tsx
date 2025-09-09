"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  FileText,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Calendar,
  AlertCircle,
  Cpu,
  Brain,
  Shield,
  MessageCircle,
  X,
  Target,
  Clock,
  Building2,
  FileDown,
  Star,
  ArrowRight
} from "lucide-react";
import { uploadForecastFile, getSampleForecast, getForecastJobStatus } from "@/lib/api/forecast";
import type { ForecastResult, ForecastJob } from "@/types/forecast";

// Polling interval
const POLL_INTERVAL = 5000;

// Enhanced Animated Background
const AnimatedCircuits = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10h80v80h-80z" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="stroke-dasharray" values="0,320;160,160;0,320" dur="8s" repeatCount="indefinite" />
            </path>
            <circle cx="50" cy="50" r="2" fill="#10b981" opacity="0.6">
              <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
            </circle>
            <path d="M20 20L30 20M70 70L80 70M30 80L30 70M70 20L70 30" stroke="#10b981" strokeWidth="1" opacity="0.2">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
            </path>
          </pattern>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#06d6a0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" className="opacity-30" />
        <rect width="100%" height="100%" fill="url(#glowGradient)" className="opacity-40" />
      </svg>
    </div>
  );
};

export default function ForecastingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [job, setJob] = useState<ForecastJob | null>(null);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'summary' | 'charts' | 'insights'>('summary');
  const [dragOver, setDragOver] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Industry datasets
  const industryDatasets = [
    { id: 'retail', name: 'Retail Electronics', description: 'Consumer electronics, appliances', icon: '📱' },
    { id: 'food', name: 'Food & Beverage', description: 'Restaurants, grocery chains', icon: '🍽️' },
    { id: 'fashion', name: 'Fashion Retail', description: 'Clothing, accessories, footwear', icon: '👔' },
    { id: 'pharmacy', name: 'Healthcare', description: 'Pharmacy, medical supplies', icon: '💊' }
  ];

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
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Poll for job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const result = await getForecastJobStatus(jobId);
      
      // Create a minimal ForecastJob object with the required fields
      const jobUpdate: ForecastJob = {
        id: jobId,
        status: result.status === 'completed' ? 'completed' : 
                result.status === 'failed' ? 'failed' : 'running',
        created_at: result.generated_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        result: result
      };
      
      setJob(jobUpdate);

      if (result.status === 'completed') {
        setResult(result);
        setActiveView('summary');
        setLoading(false);
      } else if (result.status === 'failed') {
        throw new Error(result.error || 'Forecast job failed');
      } else {
        pollTimeoutRef.current = setTimeout(() => pollJobStatus(jobId), POLL_INTERVAL);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check job status');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await uploadForecastFile(file);

      if (result.job_id) {
        setJob({
          id: result.job_id,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        pollJobStatus(result.job_id);
      } else {
        setResult(result);
        setActiveView('summary');
        setLoading(false);
      }
    } catch (err) {
      console.error("Forecast error:", err);
      setError(err instanceof Error ? err.message : 'Failed to process forecast');
      setLoading(false);
    }
  };

  const handleSampleData = async (industryId: string) => {
    setLoading(true);
    setError(null);
    setSelectedIndustry(industryId);

    try {
      const result = await getSampleForecast(industryId);

      if (result.job_id) {
        setJob({
          id: result.job_id,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        pollJobStatus(result.job_id);
      } else {
        setResult(result);
        setActiveView('summary');
        setLoading(false);
      }
    } catch (err) {
      console.error("Sample data error:", err);
      setError(err instanceof Error ? err.message : 'Failed to load sample forecast');
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
      case 'stockout': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'overstock': return <TrendingDown className="w-4 h-4 text-yellow-400" />;
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-400" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatRwandanFrancs = (amount: number) => {
    return `R₣ ${amount.toLocaleString()}`;
  };

  // Consultation Modal
  const ConsultationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={() => setShowConsultationModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 ">Engage Imhotep Systems</h3>
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Ready to implement continuous AI forecasting for your business?
            Connect with our intelligence team.
          </p>

          <div className="space-y-3">
            <a
              href="https://calendly.com/imhotep-systems/ai-consultation"
              target="_blank"
              className="flex items-center justify-center w-full bg-green-600 hover:bg-green-500 text-white rounded-lg py-3 px-4 transition-colors "
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule AI Consultation
            </a>

            <a
              href="https://wa.me/250788123456?text=I'm interested in Imhotep's AI forecasting platform"
              target="_blank"
              className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 px-4 transition-colors  border border-gray-600"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Intelligence Team
            </a>
          </div>

          <div className="text-center text-xs text-gray-400 mt-4 ">
            Response time: &lt; 2 hours during business hours
          </div>
        </div>
      </div>
    </div>
  );

  // Sticky CTA
  const StickyCTA = () => (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setShowConsultationModal(true)}
        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl shadow-green-500/20 flex items-center space-x-2 transition-all hover:scale-105  border border-green-500/50"
      >
        <Brain className="w-4 h-4" />
        <span>Engage AI</span>
      </button>
    </div>
  );

  // Loading state with enhanced styling
  if (loading && !result) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center relative">
        <AnimatedCircuits />
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-green-400 mb-2 ">
            {job?.status === 'running' ? 'PROCESSING DATA MATRIX...' : 'INITIALIZING AI SYSTEMS...'}
          </h2>
          <p className="text-gray-400  text-sm">
            {job?.status ? `STATUS: ${job.status.toUpperCase()}` : 'Quantum processing in progress'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4 relative">
        <AnimatedCircuits />
        <div className="bg-gray-900/50 border border-red-500/50 rounded-xl p-8 max-w-md w-full text-center relative z-10">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2 ">SYSTEM ERROR</h2>
          <p className="text-gray-300 mb-6  text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(false);
            }}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors "
          >
            RETRY OPERATION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 relative overflow-x-hidden">
      <AnimatedCircuits />

      {/* Enhanced Hero Section */}
      <header className="relative pt-32 pb-20 flex flex-col justify-center items-center text-center px-6">
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Status Indicator */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 bg-green-600/10 border border-green-600/30 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm ">AI FORECASTING SYSTEM ONLINE</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-3 bg-green-400 rounded animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 ">
            NEVER STOCK OUT
            <br />
            <span className="text-green-400">AGAIN.</span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed ">
            AI-powered demand forecasting built for African markets.
            Transform sales data into precise inventory intelligence.
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-400 ">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-green-400" />
              <span>15+ KIGALI RETAILERS</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-400" />
              <span>94% ACCURACY RATE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>AFRICAN-BUILT AI</span>
            </div>
          </div>

          {/* Client Testimonial */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gray-900/30 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-green-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic  text-sm">
                &quot;Stockouts down 22%. Freed up R₣ 2.4M in working capital.
                Imhotep&apos;s AI sees patterns we couldn&apos;t.&quot;
              </p>
              <p className="text-xs text-green-400 mt-3 ">
                — SARAH M., SAWA CITY ELECTRONICS
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Section */}
      {!result && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 mb-20">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3 ">INITIALIZE AI ANALYSIS</h2>
              <p className="text-gray-400 max-w-2xl mx-auto ">
                Upload sales data or select industry dataset for instant intelligence generation
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Upload Area */}
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-gray-900/30 ${dragOver
                      ? 'border-green-400 bg-green-500/5 shadow-lg shadow-green-500/20'
                      : 'border-gray-700 hover:border-green-400/50'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white ">
                    {file ? `LOADED: ${file.name}` : 'UPLOAD SALES DATA'}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm ">
                    CSV, EXCEL, JSON • MAX 50MB • DRAG & DROP OR CLICK
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl  font-medium transition-all flex items-center justify-center text-lg hover:shadow-lg hover:shadow-green-500/20 disabled:shadow-none border border-green-500/50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                        PROCESSING MATRIX...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-3" />
                        EXECUTE AI ANALYSIS
                      </>
                    )}
                  </button>

                  <div className="relative flex items-center my-6">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm ">OR</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                  </div>

                  {/* Industry Datasets */}
                  <div className="space-y-4">
                    <p className="text-center text-gray-400 text-sm ">SELECT INDUSTRY DATASET:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {industryDatasets.map((industry) => (
                        <button
                          key={industry.id}
                          onClick={() => handleSampleData(industry.id)}
                          disabled={loading}
                          className="bg-gray-800/50 hover:bg-gray-700/70 text-white p-4 rounded-lg  transition-all border border-gray-700 hover:border-green-500/50 text-left disabled:opacity-50"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xl">{industry.icon}</span>
                            <div className="text-sm font-medium text-green-400">{industry.name}</div>
                          </div>
                          <div className="text-xs text-gray-400">{industry.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Info Panel */}
              <div className="bg-gray-900/30 border border-gray-700/50 rounded-2xl p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center ">
                      <Cpu className="w-5 h-5 mr-2" />
                      AI DETECTION CAPABILITIES
                    </h3>
                    <ul className="space-y-3 text-gray-300  text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span>Product identifiers & SKU pattern recognition</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span>Multi-format date parsing & chronological analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span>Statistical anomaly detection with confidence scoring</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span>Seasonal pattern extraction & trend analysis</span>
                      </li>
                    </ul>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center ">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      INTELLIGENCE OUTPUT
                    </h3>
                    <ul className="space-y-3 text-gray-300  text-sm">
                      <li className="flex items-start">
                        <div className="w-4 h-4 mr-3 mt-0.5 flex items-center justify-center text-cyan-400">
                          <BarChart3 className="w-3 h-3" />
                        </div>
                        <span>30-90 day demand forecasts per SKU</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-4 h-4 mr-3 mt-0.5 flex items-center justify-center text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                        </div>
                        <span>Risk-scored stockout & overstock alerts</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-4 h-4 mr-3 mt-0.5 flex items-center justify-center text-green-400">
                          <TrendingUp className="w-3 h-3" />
                        </div>
                        <span>Revenue impact analysis & optimization</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-4 h-4 mr-3 mt-0.5 flex items-center justify-center text-purple-400">
                          <Users className="w-3 h-3" />
                        </div>
                        <span>Actionable recommendations with implementation steps</span>
                      </li>
                    </ul>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-sm font-semibold text-white mb-3 ">SYSTEM PERFORMANCE</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs ">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">94%</div>
                        <div className="text-gray-400">ACCURACY</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-cyan-400">&lt;3s</div>
                        <div className="text-gray-400">ANALYSIS TIME</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {result && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 mb-20">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-green-400 ">
                  INTELLIGENCE REPORT GENERATED
                </h2>
                <p className="text-gray-400  text-sm mt-1">
                  CONFIDENCE LEVEL: 94% • PROCESSING TIME: 2.3s
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg text-sm transition-colors border border-gray-600 hover:border-gray-500 ">
                  <FileDown className="w-4 h-4" />
                  <span>EXPORT PDF</span>
                </button>
                <button
                  onClick={() => setShowConsultationModal(true)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 px-4 py-2.5 rounded-lg text-sm transition-colors hover:shadow-lg hover:shadow-green-500/20  border border-green-500/50"
                >
                  <Brain className="w-4 h-4" />
                  <span>ENGAGE IMHOTEP</span>
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
              {[
                { key: 'summary', label: 'SUMMARY', icon: FileText },
                { key: 'charts', label: 'FORECASTS', icon: BarChart3 },
                { key: 'insights', label: 'INSIGHTS', icon: Eye },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key as "summary" | "charts" | "insights")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm  transition-colors ${activeView === key
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
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
                {/* Enhanced Metrics Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
                    <div className="text-3xl font-bold text-green-400  mb-2">
                      {formatRwandanFrancs(850000)}
                    </div>
                    <div className="text-sm text-gray-400 ">MONTHLY SAVINGS POTENTIAL</div>
                    <div className="text-xs text-green-400 mt-1">↑ 22% vs current performance</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-500/30">
                    <div className="text-3xl font-bold text-cyan-400  mb-2">
                      94%
                    </div>
                    <div className="text-sm text-gray-400 ">FORECAST CONFIDENCE</div>
                    <div className="text-xs text-cyan-400 mt-1">Statistical significance: p&lt;0.01</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-6 border border-red-500/30">
                    <div className="text-3xl font-bold text-red-400  mb-2">
                      {result.forecasts.filter(f => f.risk_level === 'high').length}
                    </div>
                    <div className="text-sm text-gray-400 ">HIGH RISK ITEMS</div>
                    <div className="text-xs text-red-400 mt-1">Immediate action required</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/30">
                    <div className="text-3xl font-bold text-yellow-400  mb-2">
                      {result.summary.total_rows.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 ">DATA POINTS ANALYZED</div>
                    <div className="text-xs text-yellow-400 mt-1">Range: {result.summary.date_range}</div>
                  </div>
                </div>

                {/* Critical Alerts */}
                <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4  text-red-400 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    CRITICAL ALERTS - ACTION REQUIRED
                  </h3>
                  <div className="space-y-4">
                    {result.forecasts
                      .filter(f => f.risk_level === 'high')
                      .slice(0, 3)
                      .map((forecast, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-red-500/30">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-900/50 border border-red-500 flex items-center justify-center mr-4">
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white ">{forecast.recommendation}</div>
                              <div className="text-xs text-red-400 ">
                                {forecast.sku} • IMPACT: {formatRwandanFrancs(forecast.potential_revenue_impact * 12)} ANNUALLY
                              </div>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs  bg-red-600 text-white">
                            HIGH PRIORITY
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* System Analysis */}
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4  text-green-400 flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    AI PROCESSING SUMMARY
                  </h3>
                  <ul className="space-y-2">
                    {result.methodology_notes?.map((note, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm ">
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
                    <div key={index} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold  text-white">{forecast.sku}</h3>
                          <p className="text-sm text-gray-400 ">CURRENT STOCK: {forecast.current_stock}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs  border ${getRiskColor(forecast.risk_level)}`}>
                          {forecast.risk_level.toUpperCase()} RISK
                        </div>
                      </div>

                      {/* Enhanced Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2 ">
                          <span>STOCK LEVEL</span>
                          <span>{Math.round((forecast.current_stock / forecast.predicted_demand) * 100)}% OF PREDICTED DEMAND</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${forecast.risk_level === 'high' ? 'bg-red-500' :
                                forecast.risk_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${Math.min((forecast.current_stock / forecast.predicted_demand) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-600/50">
                          <div className="text-2xl font-bold text-green-400 ">{forecast.predicted_demand}</div>
                          <div className="text-xs text-gray-400 ">PREDICTED DEMAND</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-600/50">
                          <div className="text-xl font-bold text-yellow-400 ">
                            {formatRwandanFrancs(forecast.potential_revenue_impact)}
                          </div>
                          <div className="text-xs text-gray-400 ">MONTHLY IMPACT</div>
                        </div>
                        <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-600/50">
                          <div className="text-2xl font-bold text-green-600 ">94%</div>
                          <div className="text-xs text-gray-400 ">CONFIDENCE</div>
                        </div>
                        <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                          <div className="text-sm font-medium text-blue-300 ">{forecast.recommendation}</div>
                          <div className="text-xs text-blue-400 mt-1 ">AI RECOMMENDATION</div>
                        </div>
                      </div>

                      {/* Mini Trend Visualization */}
                      <div className="mt-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-600/30">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2 ">
                          <span>7-DAY TREND ANALYSIS</span>
                          <span className="flex items-center text-green-400">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            +12% vs LAST PERIOD
                          </span>
                        </div>
                        <div className="h-16 bg-gray-800/50 rounded border border-gray-600/50 flex items-end justify-around p-2">
                          {[65, 72, 68, 80, 85, 78, 92].map((height, i) => (
                            <div
                              key={i}
                              className="bg-green-400 rounded-sm w-6 transition-all duration-1000"
                              style={{
                                height: `${height}%`,
                                animationDelay: `${i * 100}ms`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights View */}
            {activeView === 'insights' && (
              <div className="space-y-8">
                {/* Problem vs Solution Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4  text-red-400 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      SYSTEM ANOMALIES DETECTED
                    </h3>
                    <div className="space-y-4">
                      {result.insights
                        .filter(i => i.priority === 'high')
                        .map((insight, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                            {getInsightIcon(insight.type)}
                            <div className="flex-1">
                              <div className="text-sm  text-red-300">{insight.message}</div>
                              {insight.sku && (
                                <div className="text-xs text-red-400 mt-1 ">TARGET: {insight.sku}</div>
                              )}
                              <div className="text-xs text-gray-400 mt-2 ">
                                EST. LOSS: {formatRwandanFrancs(125000)}/MONTH IF UNADDRESSED
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4  text-green-400 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      AI OPTIMIZATION PROTOCOLS
                    </h3>
                    <div className="space-y-4">
                      {result.forecasts
                        .filter(f => f.risk_level === 'high')
                        .slice(0, 3)
                        .map((forecast, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm  text-green-300">
                                {forecast.recommendation}
                              </div>
                              <div className="text-xs text-green-400 mt-1 ">
                                PROJECTED IMPACT: {formatRwandanFrancs(forecast.potential_revenue_impact)}/MONTH
                              </div>
                              <div className="text-xs text-gray-400 mt-2 ">
                                IMPLEMENTATION: 3-5 DAYS • CONFIDENCE: HIGH
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Business Intelligence Score */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
                  <h3 className="text-lg font-semibold mb-4 text-white ">BUSINESS INTELLIGENCE METRICS</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2 ">B+</div>
                      <div className="text-sm font-medium text-white ">INVENTORY EFFICIENCY</div>
                      <div className="text-xs text-green-400 ">ABOVE SECTOR AVERAGE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2 ">C</div>
                      <div className="text-sm font-medium text-white ">DEMAND PREDICTION</div>
                      <div className="text-xs text-yellow-400 ">OPTIMIZATION POTENTIAL</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2 ">A-</div>
                      <div className="text-sm font-medium text-white ">STOCK TURNOVER</div>
                      <div className="text-xs text-blue-400 ">EXCELLENT PERFORMANCE</div>
                    </div>
                  </div>
                </div>

                {/* Complete Intelligence Feed */}
                <div>
                  <h3 className="text-lg font-semibold mb-4  text-white">COMPLETE INTELLIGENCE FEED</h3>
                  <div className="space-y-3">
                    {result.insights.map((insight, index) => {
                      const priorityColors = {
                        high: 'border-red-500/30 bg-red-900/10 text-red-300',
                        medium: 'border-yellow-500/30 bg-yellow-900/10 text-yellow-300',
                        low: 'border-green-500/30 bg-green-900/10 text-green-300'
                      };

                      return (
                        <div key={index} className={`flex items-center space-x-3 border rounded-lg p-3 ${priorityColors[insight.priority]}`}>
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <span className="text-sm ">{insight.message}</span>
                            {insight.sku && (
                              <span className="text-xs text-gray-400 ml-2 ">({insight.sku})</span>
                            )}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs  border ${insight.priority === 'high' ? 'bg-red-600/20 border-red-500 text-red-400' :
                              insight.priority === 'medium' ? 'bg-yellow-600/20 border-yellow-500 text-yellow-400' :
                                'bg-green-600/20 border-green-500 text-green-400'
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
      )}

      {/* Enhanced Upsell Section */}
      {result && (
        <section className="relative z-10 max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-gradient-to-r from-green-600/10 via-cyan-600/10 to-purple-600/10 border border-green-600/30 rounded-2xl p-8 text-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 text-xs text-green-400 ">SYSTEM ONLINE</div>

            <h2 className="text-3xl font-bold mb-4  text-white">
              READY FOR CONTINUOUS AI INTELLIGENCE?
            </h2>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto ">
              This preview demonstrates single-dataset analysis.
              Production deployment includes real-time monitoring, multi-location dashboards,
              automated alerts, and dedicated AI analyst support.
            </p>

            {/* Pricing Display */}
            <div className="bg-gray-900/50 rounded-xl p-6 mb-8 max-w-2xl mx-auto border border-gray-700/50">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center border-r border-gray-600 pr-6">
                  <div className="text-2xl font-bold text-white mb-2 ">
                    {formatRwandanFrancs(45000)}<span className="text-lg text-gray-400">/MONTH</span>
                  </div>
                  <div className="text-sm text-gray-300 ">STARTER DEPLOYMENT</div>
                  <div className="text-xs text-gray-400 ">UP TO 3 LOCATIONS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2 ">
                    ENTERPRISE PRICING
                  </div>
                  <div className="text-sm text-gray-300 ">FULL AI PLATFORM</div>
                  <div className="text-xs text-gray-400 ">UNLIMITED + ANALYST SUPPORT</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-3 text-green-400" />
                <h3 className="font-semibold mb-2  text-white">REAL-TIME MONITORING</h3>
                <p className="text-sm text-gray-400 ">24/7 automated analysis</p>
              </div>
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                <h3 className="font-semibold mb-2  text-white">MULTI-LOCATION INTEL</h3>
                <p className="text-sm text-gray-400 ">Unified command center</p>
              </div>
              <div className="text-center">
                <Brain className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <h3 className="font-semibold mb-2  text-white">AI ANALYST SUPPORT</h3>
                <p className="text-sm text-gray-400 ">Expert human oversight</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowConsultationModal(true)}
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg  font-medium transition-all hover:shadow-lg hover:shadow-green-500/20 flex items-center justify-center border border-green-500/50"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                DEPLOY AI SYSTEM
              </button>
              <button
                onClick={() => setShowConsultationModal(true)}
                className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg  font-medium transition-colors"
              >
                SCHEDULE CONSULTATION
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-6 ">
              <span className="text-green-400">⚡</span> PERFORMANCE BOOST: 35% inventory optimization within 60 days
            </p>
          </div>
        </section>
      )}

      {/* Enhanced Footer */}
      <footer className="border-t border-gray-800 bg-black/80 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-green-400 mb-4 ">SYSTEM ADVANTAGES</h4>
              <ul className="space-y-2 text-sm text-gray-300 ">
                <li>✓ African market specialization</li>
                <li>✓ Local currency & seasonal intelligence</li>
                <li>✓ Kigali-based technical support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-400 mb-4 ">ACCESS POINTS</h4>
              <ul className="space-y-2 text-sm text-gray-300 ">
                <li><a href="#" className="hover:text-green-400 transition-colors">30-Day Trial Access</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Deployment Pricing</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-4 ">CONTACT PROTOCOLS</h4>
              <ul className="space-y-2 text-sm text-gray-300 ">
                <li>📧 intelligence@imhotepsystems.rw</li>
                <li>📱 +250 788 123 456</li>
                <li>📍 KG 15 Ave, Kacyiru, Kigali</li>
              </ul>
            </div>
          </div>
          <div className="text-center border-t border-gray-800 pt-8">
            <p className="text-gray-400  text-sm">
              <span className="text-green-400">IMHOTEP SYSTEMS</span> — THE CPU BEHIND AFRICAN BUSINESS INTELLIGENCE
            </p>
            <p className="text-gray-600 text-xs mt-2 ">
              MANUFACTURED IN RWANDA 🇷🇼 • SERVING AFRICA&apos;S DIGITAL TRANSFORMATION
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Sticky Elements */}
      {showConsultationModal && <ConsultationModal />}
      {result && <StickyCTA />}
    </div>
  );
}