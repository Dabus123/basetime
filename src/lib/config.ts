// Contract addresses and configuration
export const CONTRACT_ADDRESSES = {
  EVENT_REGISTRY: process.env.NEXT_PUBLIC_EVENT_REGISTRY_ADDRESS || "",
  RSVP_TOKEN: process.env.NEXT_PUBLIC_RSVP_TOKEN_ADDRESS || "",
};

export const NETWORK_CONFIG = {
  CHAIN_ID: 8453, // Base mainnet
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org",
  BLOCK_EXPLORER: "https://basescan.org",
};

export const IPFS_CONFIG = {
  GATEWAY: "basetime.mypinata.cloud",
  PINATA_API_URL: "https://api.pinata.cloud/pinning/pinFileToIPFS",
};

export const APP_CONFIG = {
  NAME: "BaseTime",
  DESCRIPTION: "Social onchain calendar for the Base ecosystem",
  URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  VERSION: "1.0.0",
};

// Event categories
export const EVENT_CATEGORIES = [
  "Hackathon",
  "DAO Governance",
  "NFT Drop",
  "Community Meetup",
  "Workshop",
  "Conference",
  "Other",
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];

// Time formats
export const TIME_FORMATS = {
  DISPLAY: "MMM dd, yyyy 'at' h:mm a",
  INPUT: "yyyy-MM-dd'T'HH:mm",
  SHORT: "MMM dd",
  TIME_ONLY: "h:mm a",
} as const;
