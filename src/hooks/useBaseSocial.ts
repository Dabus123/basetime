'use client';

import { useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { formatPostForBaseSocial } from '@/lib/base-social';

interface UseBaseSocialReturn {
  postToBaseSocial: (data: {
    header: string;
    description: string;
    imageUrl: string;
    imageHeader: string;
    imageDescription: string;
  }) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash?: string;
}

export function useBaseSocial(): UseBaseSocialReturn {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  const postToBaseSocial = async (data: {
    header: string;
    description: string;
    imageUrl: string;
    imageHeader: string;
    imageDescription: string;
  }) => {
    try {
      setError(null);
      setIsLoading(true);
      setIsSuccess(false);
      
      // Format the post text
      const postText = formatPostForBaseSocial(
        data.header,
        data.description,
        data.imageUrl,
        data.imageHeader,
        data.imageDescription
      );
      
      console.log('📝 Posting to Base social:', {
        header: data.header,
        description: data.description,
        imageUrl: data.imageUrl,
        imageHeader: data.imageHeader,
        imageDescription: data.imageDescription,
        fullText: postText,
      });
      
      // Use the SDK to compose and post the cast
      const result = await sdk.actions.composeCast({
        text: postText,
        embeds: [
          {
            url: data.imageUrl,
          },
        ],
        close: false, // Keep the app open after posting
      });
      
      console.log('✅ Post result:', result);
      
      // Extract transaction hash if available
      if (result && typeof result === 'object' && 'hash' in result) {
        setTxHash(result.hash);
      }
      
      setIsSuccess(true);
      
    } catch (err) {
      console.error('Error posting to Base social:', err);
      setError(err as Error);
      setIsSuccess(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    postToBaseSocial,
    isLoading,
    isSuccess,
    isError: !!error,
    error,
    txHash,
  };
}

