// Utility functions for BaseTime
import { format } from 'date-fns';
import { Event } from '@/types';

/**
 * Format timestamp to readable date string
 */
export function formatDate(timestamp: number, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const date = new Date(timestamp * 1000);
    return format(date, formatStr);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format timestamp to readable time string
 */
export function formatTime(timestamp: number): string {
  return formatDate(timestamp, 'h:mm a');
}

/**
 * Format timestamp to readable date and time string
 */
export function formatDateTime(timestamp: number): string {
  return formatDate(timestamp, 'MMM dd, yyyy \'at\' h:mm a');
}

/**
 * Check if event is happening now
 */
export function isEventLive(event: Event): boolean {
  const now = Math.floor(Date.now() / 1000);
  return event.startTime <= now && event.endTime >= now;
}

/**
 * Check if event is upcoming
 */
export function isEventUpcoming(event: Event): boolean {
  const now = Math.floor(Date.now() / 1000);
  return event.startTime > now;
}

/**
 * Check if event has ended
 */
export function isEventEnded(event: Event): boolean {
  const now = Math.floor(Date.now() / 1000);
  return event.endTime < now;
}

/**
 * Get event status (upcoming, live, ended)
 */
export function getEventStatus(startTime: number, endTime: number): 'upcoming' | 'live' | 'ended' {
  const now = Math.floor(Date.now() / 1000);
  
  if (startTime > now) {
    return 'upcoming';
  } else if (endTime < now) {
    return 'ended';
  } else {
    return 'live';
  }
}

/**
 * Get time until event starts
 */
export function getTimeUntilEvent(event: Event): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = event.startTime - now;
  
  if (diff <= 0) {
    return 'Event started';
  }
  
  const days = Math.floor(diff / (24 * 60 * 60));
  const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate share URL for event
 */
export function generateShareUrl(eventId: number): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/event/${eventId}`;
}

/**
 * Generate OpenGraph image URL for event
 */
export function generateOGImageUrl(event: Event): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const params = new URLSearchParams({
    title: event.name,
    date: formatDateTime(event.startTime),
    image: event.image,
  });
  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format wallet address for display
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Convert seconds to human readable duration
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Get event duration in seconds
 */
export function getEventDuration(event: Event): number {
  return event.endTime - event.startTime;
}

/**
 * Check if two addresses are equal (case insensitive)
 */
export function addressesEqual(address1: string, address2: string): boolean {
  return address1.toLowerCase() === address2.toLowerCase();
}

/**
 * Generate random ID for temporary use
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
