"use client";
import { useState, useEffect } from "react";
import { 
  Cpu, 
  Brain,
  Zap,
  Target,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Upload,
  Eye,
  MessageCircle,
  Mail,
  ExternalLink,
  X,
} from "lucide-react";

// Animated background component
const AnimatedCircuits = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10h80v80h-80z" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3">
              <animate attributeName="stroke-dasharray" values="0,320;160,160;0,320" dur="8s" repeatCount="indefinite"/>
            </path>
            <circle cx="50" cy="50" r="2" fill="#10b981" opacity="0.6">
              <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite"/>
            </circle>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)"/>
      </svg>
    </div>
  );
};

// Mini demo modal component
const DemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [demoStep, setDemoStep] = useState(0);
  const [insights, setInsights] = useState<{ type: string; message: string; impact: string }[]>([]);

  useEffect(() => {
    if (isOpen && demoStep === 1) {
      setTimeout(() => {
        setInsights([
          { type: 'stockout', message: 'Product A: High stockout risk next week', impact: '+$15K revenue' },
          { type: 'trend', message: 'Category B: 35% demand increase detected', impact: 'Reorder now' },
          { type: 'opportunity', message: 'New market segment identified', impact: '+$8K potential' }
        ]);
        setDemoStep(2);
      }, 2000);
    }
  }, [isOpen, demoStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-green-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-green-400 font-mono">Quick Intelligence Demo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {demoStep === 0 && (
          <div className="text-center space-y-6">
            <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-8">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-300 mb-4">Upload your sales data or try with sample data</p>
              <button 
                onClick={() => setDemoStep(1)}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-mono transition-colors"
              >
                Use Sample Dataset
              </button>
            </div>
          </div>
        )}

        {demoStep === 1 && (
          <div className="text-center space-y-6">
            <div className="animate-spin w-12 h-12 mx-auto border-4 border-green-600 border-t-transparent rounded-full"></div>
            <p className="text-green-400 font-mono">Processing your data...</p>
            <p className="text-gray-400 text-sm">Detecting patterns, cleaning data, generating forecasts...</p>
          </div>
        )}

        {demoStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-2" />
              <p className="text-green-400 font-mono font-bold">Analysis Complete!</p>
            </div>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-sm">{insight.message}</span>
                    <span className="text-green-400 font-mono text-sm font-bold">{insight.impact}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-mono transition-colors">
                See Full Stack Demo →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stack card with interactive preview
const StackCard = ({ 
  title, 
  description, 
  kpi, 
  category,
}: {
  title: string;
  description: string;
  kpi: string;
  category: string;
  previewData: unknown;
  href: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-700 transition-all duration-300 cursor-pointer relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Badge */}
      <div className="absolute top-4 right-4">
        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-md text-xs font-mono">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-green-300 mb-3 font-mono">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 min-h-[60px]">
          {description}
        </p>

        {/* KPI Preview */}
        <div className="bg-gray-800/50 rounded-lg p-3 border border-green-600/20">
          <p className="text-green-400 font-mono text-sm font-bold">{kpi}</p>
        </div>

        {/* Preview Chart (shows on hover) */}
        {isHovered && (
          <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
            <div className="text-center space-y-4 p-6">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="bg-green-600/30 h-8 rounded animate-pulse"
                    style={{ 
                      height: `${Math.random() * 40 + 10}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-mono text-sm transition-colors">
                  Try with Sample Data
                </button>
                <button className="w-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg font-mono text-sm transition-colors">
                  View Full Demo →
                </button>
              </div>
            </div>
          </div>
        )}

        <button className="text-green-400 text-sm hover:underline flex items-center font-mono">
          View Demo <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

// Sticky CTA component
const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
      <div className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-mono font-medium transition-all duration-300 cursor-pointer flex items-center space-x-2">
        <Zap className="w-5 h-5" />
        <span>Start Free Pilot</span>
      </div>
    </div>
  );
};

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-green-400" />,
      title: "AI-Powered Insights",
      description: "Transform raw data into actionable intelligence"
    },
    {
      icon: <Cpu className="w-6 h-6 text-green-400" />,
      title: "Predictive Analytics",
      description: "Anticipate trends and make proactive decisions"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-400" />,
      title: "Enterprise-Grade Security",
      description: "Built with data protection at its core"
    }
  ];

  const stacks = [
    {
      title: "Demand Forecasting Stack",
      description: "Predict product demand, reduce stockouts, and minimize overstock with AI-driven forecasts.",
      kpi: "Reduce stockouts by 25% in 2 months",
      category: "AI-Driven",
      previewData: {},
      href: "/stacks/demand-forecast"
    },
    {
      title: "Operations Optimization Stack",
      description: "Streamline manufacturing, logistics, and distribution with predictive analytics and process intelligence.",
      kpi: "Increase efficiency by 30% in 6 weeks",
      category: "Predictive",
      previewData: {},
      href: "/stacks/operations"
    },
    {
      title: "Policy & Governance Stack",
      description: "Equip governments with actionable insights for smarter urban planning, budgeting, and citizen services.",
      kpi: "Optimize budget allocation by 20%",
      category: "Governance",
      previewData: {},
      href: "/stacks/governance"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-200 relative">
      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden px-6">
        <AnimatedCircuits />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-600/10 border border-green-600/30 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Empowering businesses with intelligent automation</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Intelligent Systems for <span className="text-green-400">Smarter Operations</span>
          </h1>
          
          <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Imhotep Systems builds the hidden intelligence behind efficient businesses. 
            Our AI-powered solutions deliver predictive insights and automation that drive 
            productivity and innovation at scale.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 bg-green-500 text-black rounded-lg shadow-lg hover:bg-green-400 transition-all duration-300 font-semibold flex items-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Request Demo</span>
            </button>
            <a 
              href="#solutions"
              className="px-8 py-4 border border-gray-600 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
            >
              Explore Solutions
            </a>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-green-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* What We Do Section */}
      <section id="solutions" className="py-20 px-6 md:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The Intelligence Behind <span className="text-green-400">Operational Excellence</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We build the foundation for data-driven decision making across your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Forecasting */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Forecasting</h3>
              <p className="text-gray-400 mb-6">
                Leverage advanced machine learning to predict demand, optimize inventory, and reduce waste with unprecedented accuracy.
              </p>
              <ul className="space-y-3">
                {['Demand prediction', 'Inventory optimization', 'Supply chain analytics', 'Market trend analysis'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process Automation */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Process Automation</h3>
              <p className="text-gray-400 mb-6">
                Streamline operations with intelligent automation that learns and adapts to your business processes.
              </p>
              <ul className="space-y-3">
                {['Workflow automation', 'Document processing', 'Data extraction', 'Task orchestration'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decision Intelligence */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-green-500/30 transition-all duration-300">
              <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Decision Intelligence</h3>
              <p className="text-gray-400 mb-6">
                Transform data into strategic insights with our advanced analytics and visualization tools.
              </p>
              <ul className="space-y-3">
                {['Predictive analytics', 'Scenario modeling', 'Performance dashboards', 'Real-time reporting'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/10 transition-all duration-300 font-medium flex items-center mx-auto">
              Explore All Solutions
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Stacks Overview */}
      <section className="py-20 px-6 md:px-16 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-6">
              Intelligence Stacks
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Modular AI systems that plug into your business, delivering predictive capabilities without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stacks.map((stack, index) => (
              <StackCard key={index} {...stack} />
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-gray-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">3</div>
              <div className="text-gray-400 text-sm">Ready Stacks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">25%</div>
              <div className="text-gray-400 text-sm">Avg Efficiency Gain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">2</div>
              <div className="text-gray-400 text-sm">Weeks to Deploy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-gray-400 text-sm">African-Focused</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Imhotep Section */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-6">
              Why Imhotep Systems?
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Built specifically for African markets, handling real-world data challenges with intelligence that adapts to your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">African Market Focus</h3>
                  <p className="text-gray-400">Built for African business realities - complex supply chains, diverse currencies, and unique market dynamics.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-yellow-300 mb-2">Handles Messy Data</h3>
                  <p className="text-gray-400">Our AI cleans, structures, and makes sense of incomplete or inconsistent data - no perfect datasets required.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">Modular Intelligence</h3>
                  <p className="text-gray-400">Start with one stack, add more as you grow. Each system works independently or together for complete business intelligence.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">SME & Government Ready</h3>
                  <p className="text-gray-400">Designed for organizations of all sizes - from small businesses to government departments.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-300 mb-2">Pilot-First Approach</h3>
                  <p className="text-gray-400">Start with a focused pilot project, see immediate results, then scale across your organization.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">Immediate Value</h3>
                  <p className="text-gray-400">See actionable insights within days, not months. Our stacks are pre-built and ready to deploy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Under the Hood - Enhanced */}
      <section className="py-20 px-6 md:px-16 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-400 mb-6">
              Under the Hood
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Imhotep Systems is designed like the mind — a hidden force powering intelligence, efficiency, and resilience. 
              Each stack is a modular system you can plug into your business, giving you predictive capabilities without the guesswork.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-600">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Raw Data In</h3>
                <p className="text-sm text-gray-500">Messy, incomplete, real-world data</p>
              </div>

              <div className="text-center mx-8">
                <ArrowRight className="w-8 h-8 text-green-400" />
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-600">
                  <Brain className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-green-300 mb-2">Imhotep Mind</h3>
                <p className="text-sm text-gray-500">AI processing & intelligence</p>
              </div>

              <div className="text-center mx-8">
                <ArrowRight className="w-8 h-8 text-green-400" />
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-yellow-600">
                  <Eye className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Insights Out</h3>
                <p className="text-sm text-gray-500">Actionable recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/Contact Section */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-6">
            Ready to Add Intelligence to Your Business?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Start with a free pilot, see immediate results, and scale the intelligence that fits your business.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-lg mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email for pilot info"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-mono transition-colors whitespace-nowrap">
              Start Pilot
            </button>
          </div>

          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12 px-6 md:px-16 bg-black border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-sm flex items-center justify-center">
                  <span className="text-black font-bold text-sm">I</span>
                </div>
                <span className="text-xl font-bold text-green-400">Imhotep</span>
              </div>
              <p className="text-gray-400 text-sm">
                The CPU behind African business intelligence
              </p>
            </div>
            
            <div>
              <h3 className="text-green-400 font-semibold mb-3">Stacks</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Demand Forecasting</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Operations</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Governance</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-green-400 font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Pilots</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-green-400 font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">WhatsApp</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm font-mono">
              &copy; {new Date().getFullYear()} Imhotep Systems. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
      
      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  );
}