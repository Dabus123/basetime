// Types for BaseTime application
export interface Event {
  id: number;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  image: string;
  onchainAction: string;
  creator: string;
  isActive: boolean;
  rsvpCount: number;
  isPublic?: boolean; // Flag to indicate if this is a public event
}

export interface EventPass {
  tokenId: number;
  eventId: number;
  tokenURI: string;
  owner: string;
}

export interface CreateEventData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  image: string;
  onchainAction: string;
  isPublic?: boolean; // Flag to indicate if this is a public event
}

export interface UserProfile {
  address: string;
  name?: string;
  avatar?: string;
  rsvpCount: number;
  eventsCreated: number;
}

export interface CalendarView {
  type: 'month' | 'week' | 'list';
  date: Date;
}

export interface RSVPStatus {
  hasRSVPed: boolean;
  tokenId?: number;
  tokenURI?: string;
}

export interface ShareData {
  title: string;
  description: string;
  image: string;
  url: string;
  eventId: number;
}
