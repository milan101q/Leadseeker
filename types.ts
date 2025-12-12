export interface BusinessLead {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  phone: string;
  address: string;
  postalCode: string;
  mapsUrl: string;
  hasWebsite: boolean;
  website?: string;
  type: string;
}

export interface SearchParams {
  location: string;
  quantity: number;
  minReviews: number;
  maxDistance: number;
  ratingThreshold: number;
  requireNoWebsite: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'process';
}

export enum AppStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED'
}