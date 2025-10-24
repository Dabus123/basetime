/**
 * Base Social Protocol Integration
 * Handles posting to Base social feed via Farcaster protocol
 */

import { encodeFunctionData, parseAbi } from 'viem';

// Base Social Protocol Contract (Farcaster)
export const FARCASTER_ID_REGISTRY = '0x00000000FcCe7f938e7aE6D3c335bD6a1a7c593D' as const;
export const FARCASTER_KEY_GATEWAY = '0x00000000fc56947c7E7183f8Ca4B62398CaAdf0B' as const;
export const FARCASTER_STORAGE_REGISTRY = '0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D' as const;

// Base Social Hub Contract (Actual TBA contract)
export const BASE_SOCIAL_HUB = '0xfe2eF628b62086eAce62fdBD4292F1aBDB48c3C9' as const;

// Handle Ops ABI (Account Abstraction pattern)
export const SOCIAL_HUB_ABI = parseAbi([
  'function handleOps((address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[], address beneficiary) external',
]);

export interface CastData {
  text: string;
  embeds?: CastEmbed[];
  mentions?: number[];
  mentionsPositions?: number[];
}

export interface CastEmbed {
  url?: string;
  castId?: {
    fid: number;
    hash: string;
  };
}

/**
 * Encode cast data for posting to Base social feed
 */
export function encodeCastData(cast: CastData): {
  messageType: bigint;
  message: string;
  embeds: string[];
} {
  // Message type: 1 = CastAdd
  const messageType = BigInt(1);
  
  // Encode the cast message
  const message = JSON.stringify({
    text: cast.text,
    mentions: cast.mentions || [],
    mentionsPositions: cast.mentionsPositions || [],
  });
  
  // Encode embeds
  const embeds = cast.embeds?.map(embed => JSON.stringify(embed)) || [];
  
  return {
    messageType,
    message,
    embeds,
  };
}

/**
 * Create a cast with text and image embed
 */
export function createCastWithImage(text: string, imageUrl: string): CastData {
  return {
    text,
    embeds: [
      {
        url: imageUrl,
      },
    ],
  };
}

/**
 * Prepare transaction data for posting a cast
 */
export function prepareCastTransaction(
  fid: bigint,
  cast: CastData
): {
  to: `0x${string}`;
  data: `0x${string}`;
} {
  const { messageType, message, embeds } = encodeCastData(cast);
  
  const data = encodeFunctionData({
    abi: SOCIAL_HUB_ABI,
    functionName: embeds.length > 0 ? 'publishCastWithEmbeds' : 'publishCast',
    args: embeds.length > 0 
      ? [fid, messageType, message, [], embeds]
      : [fid, messageType, message, []],
  });
  
  return {
    to: BASE_SOCIAL_HUB,
    data,
  };
}

/**
 * Format post data for Base social feed
 */
export function formatPostForBaseSocial(
  header: string,
  description: string,
  imageUrl: string,
  imageHeader: string,
  imageDescription: string
): string {
  // Include image URL in text to trigger automatic image detection
  // This is a common approach for social platforms
  if (imageUrl) {
    return `${header}\n\n${description}\n\n${imageUrl}`;
  }
  return `${header}\n\n${description}`;
}

