'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Event } from '@/types';
import { CONTRACT_ADDRESSES } from '@/lib/config';
import { DUMMY_EVENTS, DUMMY_USER_RSVPS } from '@/lib/dummyData';

// EventRegistry ABI
const EVENT_REGISTRY_ABI = [
  {
    "inputs": [
      {"name": "_name", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_startTime", "type": "uint256"},
      {"name": "_endTime", "type": "uint256"},
      {"name": "_image", "type": "string"},
      {"name": "_onchainAction", "type": "string"}
    ],
    "name": "createEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_eventId", "type": "uint256"}],
    "name": "rsvpToEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_eventId", "type": "uint256"}],
    "name": "cancelRSVP",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveEvents",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "name", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "startTime", "type": "uint256"},
          {"name": "endTime", "type": "uint256"},
          {"name": "image", "type": "string"},
          {"name": "onchainAction", "type": "string"},
          {"name": "creator", "type": "address"},
          {"name": "isActive", "type": "bool"},
          {"name": "rsvpCount", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_eventId", "type": "uint256"}, {"name": "_user", "type": "address"}],
    "name": "hasRSVPed",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getUserRSVPs",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: activeEvents, refetch, error: contractError } = useReadContract({
    address: CONTRACT_ADDRESSES.EVENT_REGISTRY as `0x${string}`,
    abi: EVENT_REGISTRY_ABI,
    functionName: 'getActiveEvents',
  });

  useEffect(() => {
    // If contract call fails or returns no data, use dummy data
    if (contractError || !activeEvents) {
      console.log('Using dummy data for events');
      setEvents(DUMMY_EVENTS);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (activeEvents) {
      const formattedEvents: Event[] = activeEvents.map((event: {
        id: bigint;
        name: string;
        description: string;
        startTime: bigint;
        endTime: bigint;
        image: string;
        onchainAction: string;
        creator: string;
        isActive: boolean;
        rsvpCount: bigint;
      }) => ({
        id: Number(event.id),
        name: event.name,
        description: event.description,
        startTime: Number(event.startTime),
        endTime: Number(event.endTime),
        image: event.image,
        onchainAction: event.onchainAction,
        creator: event.creator,
        isActive: event.isActive,
        rsvpCount: Number(event.rsvpCount),
      }));
      
      setEvents(formattedEvents);
      setIsLoading(false);
      setError(null);
    }
  }, [activeEvents, contractError]);

  const refreshEvents = useCallback(() => {
    setIsLoading(true);
    refetch();
  }, [refetch]);

  return {
    events,
    isLoading,
    error,
    refreshEvents,
  };
}

export function useUserRSVPs(userAddress?: string) {
  const [userRSVPs, setUserRSVPs] = useState<Set<number>>(new Set());

  const { data: rsvpIds, error: contractError } = useReadContract({
    address: CONTRACT_ADDRESSES.EVENT_REGISTRY as `0x${string}`,
    abi: EVENT_REGISTRY_ABI,
    functionName: 'getUserRSVPs',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  useEffect(() => {
    // If contract call fails or no user address, use dummy data
    if (contractError || !userAddress) {
      console.log('Using dummy data for user RSVPs');
      setUserRSVPs(DUMMY_USER_RSVPS);
      return;
    }

    if (rsvpIds) {
      const rsvpSet = new Set(rsvpIds.map((id: bigint) => Number(id)));
      setUserRSVPs(rsvpSet);
    }
  }, [rsvpIds, contractError, userAddress]);

  return {
    userRSVPs,
  };
}

export function useEventActions() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createEvent = useCallback(async (eventData: {
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    image: string;
    onchainAction: string;
  }) => {
    if (!address) throw new Error('Wallet not connected');

    // Check if contract is deployed
    if (!CONTRACT_ADDRESSES.EVENT_REGISTRY || CONTRACT_ADDRESSES.EVENT_REGISTRY === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed. Please deploy contracts first.');
    }

    const startTimestamp = Math.floor(new Date(eventData.startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(eventData.endTime).getTime() / 1000);

    await writeContract({
      address: CONTRACT_ADDRESSES.EVENT_REGISTRY as `0x${string}`,
      abi: EVENT_REGISTRY_ABI,
      functionName: 'createEvent',
      args: [
        eventData.name,
        eventData.description,
        BigInt(startTimestamp),
        BigInt(endTimestamp),
        eventData.image,
        eventData.onchainAction,
      ],
    });
  }, [address, writeContract]);

  const rsvpToEvent = useCallback(async (eventId: number) => {
    if (!address) throw new Error('Wallet not connected');

    // Check if contract is deployed
    if (!CONTRACT_ADDRESSES.EVENT_REGISTRY || CONTRACT_ADDRESSES.EVENT_REGISTRY === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed. Please deploy contracts first.');
    }

    await writeContract({
      address: CONTRACT_ADDRESSES.EVENT_REGISTRY as `0x${string}`,
      abi: EVENT_REGISTRY_ABI,
      functionName: 'rsvpToEvent',
      args: [BigInt(eventId)],
    });
  }, [address, writeContract]);

  const cancelRSVP = useCallback(async (eventId: number) => {
    if (!address) throw new Error('Wallet not connected');

    // Check if contract is deployed
    if (!CONTRACT_ADDRESSES.EVENT_REGISTRY || CONTRACT_ADDRESSES.EVENT_REGISTRY === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed. Please deploy contracts first.');
    }

    await writeContract({
      address: CONTRACT_ADDRESSES.EVENT_REGISTRY as `0x${string}`,
      abi: EVENT_REGISTRY_ABI,
      functionName: 'cancelRSVP',
      args: [BigInt(eventId)],
    });
  }, [address, writeContract]);

  return {
    createEvent,
    rsvpToEvent,
    cancelRSVP,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}
