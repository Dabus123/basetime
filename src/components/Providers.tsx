'use client';

import React, { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { config } from '@/lib/wagmi-config';
import { PulseLoader } from './LoadingSpinner';
import { sdk } from '@farcaster/miniapp-sdk';

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize Farcaster SDK with proper error handling
    const initializeSDK = async () => {
      try {
        // Check if we're in a Mini App environment
        if (typeof window !== 'undefined' && window.location !== window.parent.location) {
          // We're in an iframe (Mini App environment)
          await sdk.actions.ready();
          console.log('✅ Farcaster SDK initialized successfully');
        } else {
          console.log('ℹ️ Not in Mini App environment, skipping SDK initialization');
        }
      } catch (error) {
        console.warn('⚠️ Failed to initialize Farcaster SDK:', error);
        // Don't throw - this is not critical for the app to function
      }
    };
    
    initializeSDK();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PulseLoader className="mx-auto mb-4" />
          <p className="text-gray-600">Loading BaseTime...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
