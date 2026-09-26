export interface TouristPlace {
  id: string;
  name: string;
  city: string;
  category: 'Heritage' | 'Nature' | 'Culture' | 'Entertainment' | 'Spiritual';
  rating: number;
  reviewCount: number;
  entryFee: number;
  description: string;
  highlights: string[];
  imageUrl: string;
  operatingHours: string;
  recommendedDuration: string;
}

export interface Homestay {
  id: string;
  title: string;
  city: string;
  hostName: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  amenities: string[];
  description: string;
  imageUrl: string;
  superhost: boolean;
}

export interface TourismProduct {
  id: string;
  title: string;
  category: 'Guided Tour' | 'Attraction Pass' | 'Experience' | 'Weekend Package';
  price: number;
  duration: string;
  rating: number;
  description: string;
  included: string[];
  imageUrl: string;
}

export interface BookingRequest {
  guestName: string;
  email: string;
  phone: string;
  targetId: string;
  targetType: 'homestay' | 'place' | 'product';
  targetTitle: string;
  checkInDate: string;
  checkOutDate?: string;
  guests: number;
  specialRequests?: string;
}

export interface BookingResponse extends BookingRequest {
  bookingId: string;
  totalAmount: number;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface LoadTestPoint {
  virtualUsers: number;
  totalRequests: number;
  requestsPerSecond: number;
  avgResponseTimeMs: number;
  p90ResponseTimeMs: number;
  p95ResponseTimeMs: number;
  errorRatePercent: number;
  cpuPercent: number;
  memoryPercent: number;
  testDurationSeconds: number;
  timestamp?: string;
  status: 'PASS' | 'INVESTIGATE' | 'CRITICAL';
}

export interface PerformanceThresholds {
  avgResponseTimeMs: number; // default 1000
  errorRatePercent: number;  // default 5.0
  cpuWarningPercent: number; // default 80.0
  memoryWarningPercent: number; // default 80.0
}

export interface BottleneckItem {
  id: string;
  metric: string;
  observedValue: string;
  thresholdValue: string;
  severity: 'low' | 'warning' | 'critical';
  title: string;
  description: string;
  recommendation: string;
}

export interface CapacityEvaluation {
  status: 'Within defined performance criteria' | 'Performance threshold exceeded';
  isPassing: boolean;
  maxObservedCapacityUsers: number;
  testedVirtualUsers: number;
  bottlenecks: BottleneckItem[];
  observations: string[];
  recommendations: string[];
}

export interface TestRunReport {
  id: string;
  name: string;
  source: 'DEMO' | 'LIVE_SIMULATION' | 'AZURE_IMPORT';
  testedUrl: string;
  endpointTested: string;
  executedAt: string;
  dataPoints: LoadTestPoint[];
  thresholds: PerformanceThresholds;
  summary: {
    maxSafeVirtualUsers: number;
    peakRps: number;
    avgLatencyMs: number;
    overallErrorRate: number;
  };
}
