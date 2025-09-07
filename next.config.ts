import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // Enable Turbopack with proper configuration
  experimental: {
    turbo: {
      // Add any necessary loaders here if needed
      loaders: {
        // Example:
        // '.md': ['markdown-loader'],
      },
      rules: {
        // Add any custom Turbopack rules here
      },
    },
  },
  // Keep Webpack configuration for non-Turbopack builds
  webpack: (config) => {
    // Add TypeScript path aliases
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './src'),
      };
    }
    return config;
  },
  // Enable CSS modules and other compilers
  compiler: {
    styledComponents: true,
  },
  // Transpile auth-options.ts
  transpilePackages: ['@/lib/auth-options'],
};

export default nextConfig;
