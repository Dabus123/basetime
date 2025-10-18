'use client';

import React, { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains';
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
    
    // Call sdk.actions.ready() to hide the loading splash screen
    // This should be called as soon as the app is ready to be displayed
    sdk.actions.ready().catch((error) => {
      console.warn('Failed to call sdk.actions.ready():', error);
      // Don't throw - this is not critical for the app to function
    });
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
          chain={baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
