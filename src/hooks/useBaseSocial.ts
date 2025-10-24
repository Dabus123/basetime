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
      
      // Check if SDK is available
      if (!sdk || !sdk.actions) {
        throw new Error('Farcaster SDK not available. Please ensure you are running in a Mini App environment.');
      }
      
      console.log('📝 Posting to Base social:', {
        header: data.header,
        description: data.description,
        imageUrl: data.imageUrl,
        imageHeader: data.imageHeader,
        imageDescription: data.imageDescription,
        fullText: postText,
        hasImage: !!data.imageUrl,
        tryingMultipleApproaches: true,
      });
      
      // Use the SDK to compose and post the cast
      // Try multiple approaches for image embedding
      let result;
      
      // For Mini Apps, we might need to post text only and let the Mini App's meta tags handle image display
      // The image will be shown when the Mini App is shared, not in the post itself
      
      if (data.imageUrl) {
        // Try a completely different approach - maybe Base social needs a different URL format
        console.log('🖼️ Trying different image URL approaches...');
        
        // Try different URL formats that might work better with Base social
        const imageUrl = data.imageUrl;
        
        // Approach 1: Try with embeds using different formats
        try {
          console.log('🔗 Trying embeds with IPFS URL...');
          result = await sdk.actions.composeCast({
            text: `${data.header}\n\n${data.description}`,
            embeds: [imageUrl],
            close: false,
          });
          console.log('✅ Embeds with IPFS URL succeeded!');
        } catch (embedError) {
          console.log('❌ Embeds with IPFS URL failed:', embedError);
          
          // Approach 2: Try with just the URL in text (let Base social auto-detect)
          try {
            console.log('📝 Trying with URL in text for auto-detection...');
            result = await sdk.actions.composeCast({
              text: `${data.header}\n\n${data.description}\n\n${imageUrl}`,
              close: false,
            });
            console.log('✅ URL in text succeeded!');
          } catch (textError) {
            console.log('❌ URL in text failed:', textError);
            
            // Approach 3: Try with a different gateway
            try {
              console.log('🌐 Trying with different IPFS gateway...');
              // Convert Pinata gateway to public gateway
              const publicGatewayUrl = imageUrl.replace('gateway.pinata.cloud', 'ipfs.io');
              result = await sdk.actions.composeCast({
                text: `${data.header}\n\n${data.description}\n\n${publicGatewayUrl}`,
                close: false,
              });
              console.log('✅ Different gateway succeeded!');
            } catch (gatewayError) {
              console.log('❌ Different gateway failed:', gatewayError);
              
              // Final fallback: Just text without image
              console.log('📝 Final fallback: text only');
              result = await sdk.actions.composeCast({
                text: `${data.header}\n\n${data.description}`,
                close: false,
              });
            }
          }
        }
      } else {
        // No image, just text - use the working method
        console.log('📝 Using text-only posting method...');
        result = await sdk.actions.composeCast({
          text: postText,
          close: false,
        });
      }
      
      console.log('✅ Post result:', result);
      
      // Extract transaction hash if available
      if (result && typeof result === 'object' && 'hash' in result) {
        setTxHash(result.hash as string);
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

