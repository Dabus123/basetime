// Dummy data for development and testing
import { Event } from '@/types';

export const DUMMY_EVENTS: Event[] = [
  {
    id: 1,
    name: "Base Hackathon 2024",
    description: "Join us for the biggest hackathon in the Base ecosystem! Build the future of onchain applications with prizes up to $100k. This is a 48-hour event where developers will create innovative dApps, DeFi protocols, and social applications on Base.",
    startTime: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
    endTime: Math.floor(Date.now() / 1000) + 9 * 24 * 60 * 60, // 9 days from now
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    onchainAction: "https://basehackathon.com",
    creator: "0x1234567890123456789012345678901234567890",
    isActive: true,
    rsvpCount: 127,
  },
  {
    id: 2,
    name: "Base DAO Governance Call",
    description: "Monthly governance call to discuss Base DAO proposals and community initiatives. We'll cover upcoming protocol upgrades, treasury management, and community-driven initiatives. All Base DAO members are welcome to participate.",
    startTime: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // 3 days from now
    endTime: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60 + 2 * 60 * 60, // 3 days + 2 hours
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
    onchainAction: "",
    creator: "0x2345678901234567890123456789012345678901",
    isActive: true,
    rsvpCount: 89,
  },
  {
    id: 3,
    name: "BaseTime Genesis NFT Drop",
    description: "Exclusive NFT drop for early BaseTime users! Limited edition Event Pass NFTs featuring unique Base ecosystem artwork. Only 1000 NFTs will be minted. First come, first served!",
    startTime: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60, // 5 days from now
    endTime: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60 + 4 * 60 * 60, // 5 days + 4 hours
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=400&fit=crop",
    onchainAction: "https://basetime.com/mint",
    creator: "0x3456789012345678901234567890123456789012",
    isActive: true,
    rsvpCount: 234,
  },
  {
    id: 4,
    name: "DeFi Protocol Workshop",
    description: "Learn how to build DeFi protocols on Base! This hands-on workshop covers smart contract development, liquidity pools, yield farming, and security best practices. Perfect for developers looking to enter the DeFi space.",
    startTime: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60, // 2 days from now
    endTime: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60 + 6 * 60 * 60, // 2 days + 6 hours
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    onchainAction: "",
    creator: "0x4567890123456789012345678901234567890123",
    isActive: true,
    rsvpCount: 156,
  },
  {
    id: 5,
    name: "Base Community Meetup",
    description: "Join fellow Base builders for an informal meetup! Network with developers, discuss latest Base updates, share project ideas, and enjoy some Base-themed swag. Food and drinks provided!",
    startTime: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60, // 1 day from now
    endTime: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60 + 3 * 60 * 60, // 1 day + 3 hours
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop",
    onchainAction: "",
    creator: "0x5678901234567890123456789012345678901234",
    isActive: true,
    rsvpCount: 78,
  },
  {
    id: 6,
    name: "NFT Marketplace Launch",
    description: "Celebrate the launch of Base's premier NFT marketplace! Discover new artists, bid on exclusive collections, and learn about the future of digital art on Base. Special guest speakers and live minting sessions.",
    startTime: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60, // 10 days from now
    endTime: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60 + 8 * 60 * 60, // 10 days + 8 hours
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
    onchainAction: "https://basemarketplace.com",
    creator: "0x6789012345678901234567890123456789012345",
    isActive: true,
    rsvpCount: 312,
  },
];

export const DUMMY_USER_RSVPS = new Set([1, 3, 5]); // User has RSVPed to events 1, 3, and 5

export const DUMMY_CATEGORIES = [
  "Hackathon",
  "DAO Governance", 
  "NFT Drop",
  "Workshop",
  "Community Meetup",
  "Conference",
  "Other",
] as const;
