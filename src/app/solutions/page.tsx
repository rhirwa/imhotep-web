"use client";

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { ArrowRight } from 'lucide-react';

// Animated background component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path 
              d="M10 10h80v80h-80z" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="0.5" 
              opacity="0.3"
            >
              <animate 
                attributeName="stroke-dasharray" 
                values="0,320;160,160;0,320" 
                dur="8s" 
                repeatCount="indefinite"
              />
            </path>
            <circle 
              cx="50" 
              cy="50" 
              r="2" 
              fill="#10b981" 
              opacity="0.6"
            >
              <animate 
                attributeName="r" 
                values="2;4;2" 
                dur="4s" 
                repeatCount="indefinite"
              />
            </circle>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" opacity="0.2"/>
      </svg>
    </div>
  );
};

type SolutionCardBaseProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  kpi: string;
  category: string;
  comingSoon?: boolean;
};

type SolutionCardProps = SolutionCardBaseProps & {
  href: string;
};

const solutions: SolutionCardProps[] = [
  {
    title: 'Demand Forecast',
    description: 'Leverage AI to predict future demand with 95% accuracy, optimize inventory levels, and reduce waste.',
    href: '/solutions/demand-forecast',
    icon: <Icons.lineChart className="h-8 w-8 text-green-400" />,
    kpi: '↑ 23% forecast accuracy',
    category: 'AI/ML',
  },
  {
    title: 'Inventory Optimization',
    description: 'Automated inventory management that maintains optimal stock levels and reduces carrying costs.',
    href: '#',
    icon: <Icons.package className="h-8 w-8 text-blue-400" />,
    kpi: '↓ 35% stockouts',
    category: 'Automation',
    comingSoon: true,
  },
  {
    title: 'Supply Chain Analytics',
    description: 'End-to-end visibility and actionable insights across your entire supply chain network.',
    href: '#',
    icon: <Icons.network className="h-8 w-8 text-purple-400" />,
    kpi: '17% cost reduction',
    category: 'Analytics',
    comingSoon: true,
  },
];

function SolutionCard({ 
  title, 
  description, 
  icon, 
  kpi, 
  category,
  comingSoon 
}: SolutionCardBaseProps) {
  return (
    <div 
      className={`relative group bg-gray-900/80 rounded-2xl shadow-lg p-6 border transition-all duration-300 cursor-pointer h-full flex flex-col 
        ${comingSoon 
          ? 'border-gray-800 hover:border-gray-700' 
          : 'border-gray-700 hover:border-green-500/50 hover:shadow-green-500/10'
        }`}
    >
      {comingSoon && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-700">
            Coming Soon
          </span>
        </div>
      )}
      {/* Category Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-gray-800/50 border border-gray-700">
          {icon}
        </div>
        {!comingSoon && (
          <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-md text-xs font-mono">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 flex-grow">
        <h3 className="text-xl font-semibold text-green-300 mb-3 font-mono">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {description}
        </p>

        {/* KPI Preview */}
        {!comingSoon && (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-green-600/20 mt-auto">
            <p className="text-green-400 font-mono text-sm font-bold">{kpi}</p>
          </div>
        )}

        {!comingSoon && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="text-green-400 text-sm font-mono">{kpi}</div>
              <span className="inline-flex items-center text-green-400 text-sm font-mono group-hover:translate-x-1 transition-transform">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
            AI-Powered <span className="text-green-400">Solutions</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Transform your business with our cutting-edge AI solutions designed to optimize operations and drive growth.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-500 transition-colors"
            >
              Contact Sales
            </Link>
            <Link 
              href="/docs" 
              className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-transparent px-6 py-3 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-800 transition-colors"
            >
              Documentation
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution) => (
            <Link 
              href={!solution.comingSoon ? solution.href : '#'} 
              key={solution.title}
              className="block h-full"
              aria-disabled={solution.comingSoon}
            >
              <SolutionCard {...solution} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
