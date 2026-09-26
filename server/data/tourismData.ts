import { TouristPlace, Homestay, TourismProduct, TestRunReport } from '../../src/types/index.js';

export const touristPlaces: TouristPlace[] = [
  {
    id: 'place-1',
    name: 'Charminar & Old City',
    city: 'Hyderabad',
    category: 'Heritage',
    rating: 4.8,
    reviewCount: 1420,
    entryFee: 25,
    description: 'Iconic 16th-century mosque and monumental gateway featuring four ornate 48.7-meter minarets overlooking historic bustling bazaars.',
    highlights: ['1591 CE Sultanate Architecture', 'Laad Bazaar Pearl Market', 'Panoramic 2nd-floor balcony views'],
    imageUrl: 'https://images.unsplash.com/photo-1572455857811-045fb4255b5d?auto=format&fit=crop&w=800&q=80',
    operatingHours: '09:00 AM - 05:30 PM',
    recommendedDuration: '2 hours'
  },
  {
    id: 'place-2',
    name: 'Golconda Fort & Acoustic Vaults',
    city: 'Hyderabad',
    category: 'Heritage',
    rating: 4.7,
    reviewCount: 1980,
    entryFee: 50,
    description: 'Medieval citadel renowned for acoustic engineering where a hand clap at the entrance dome resonates at the highest pavilion 1 km away.',
    highlights: ['Acoustic Dome Engineering', 'Fateh Darwaza Royal Gateway', 'Evening Sound & Light Show'],
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f444f494?auto=format&fit=crop&w=800&q=80',
    operatingHours: '09:00 AM - 06:00 PM',
    recommendedDuration: '3 hours'
  },
  {
    id: 'place-3',
    name: 'Qutb Shahi Royal Tombs',
    city: 'Hyderabad',
    category: 'Heritage',
    rating: 4.6,
    reviewCount: 890,
    entryFee: 30,
    description: 'Magnificent domed mausoleums set amidst landscaped Persian-style gardens commemorating the seven rulers of the Qutb Shahi dynasty.',
    highlights: ['Intricate Stucco Reliefs', 'Ibrahim Bagh Gardens', 'Grand Octagonal Domes'],
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    operatingHours: '09:30 AM - 04:30 PM',
    recommendedDuration: '1.5 hours'
  },
  {
    id: 'place-4',
    name: 'Hussain Sagar Lake & Monolithic Buddha',
    city: 'Hyderabad',
    category: 'Nature',
    rating: 4.5,
    reviewCount: 2200,
    entryFee: 100,
    description: 'Heart-shaped artificial lake built in 1563, featuring an 18-meter, 450-ton monolithic white granite Buddha statue anchored at Gibraltar Rock.',
    highlights: ['Speedboat & Ferry Rides', 'Necklace Road Promenade', 'Sunset Skyline Views'],
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80',
    operatingHours: '08:00 AM - 10:00 PM',
    recommendedDuration: '2 hours'
  },
  {
    id: 'place-5',
    name: 'Salar Jung Museum',
    city: 'Hyderabad',
    category: 'Culture',
    rating: 4.7,
    reviewCount: 3100,
    entryFee: 50,
    description: 'One of the three National Museums of India housing the legendary Veiled Rebecca marble sculpture and a rare antique musical bracket clock.',
    highlights: ['Veiled Rebecca by GB Benzoni', '19th-Century Musical Clock', 'Rare Mughal Miniature Paintings'],
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
    operatingHours: '10:00 AM - 05:00 PM (Closed Fridays)',
    recommendedDuration: '3.5 hours'
  },
  {
    id: 'place-6',
    name: 'Chowmahalla Palace',
    city: 'Hyderabad',
    category: 'Heritage',
    rating: 4.7,
    reviewCount: 1650,
    entryFee: 80,
    description: 'Seat of the Asaf Jahi dynasty featuring ceremonial durbar halls, Belgian crystal chandeliers, and vintage royal Rolls Royce motorcars.',
    highlights: ['Khilwat Mubarak Grand Hall', '1912 Rolls Royce Silver Ghost', 'Vintage Clock Tower'],
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    operatingHours: '10:00 AM - 05:00 PM (Closed Fridays)',
    recommendedDuration: '2 hours'
  }
];

export const homestays: Homestay[] = [
  {
    id: 'stay-1',
    title: 'Nizam Heritage Courtyard Villa',
    city: 'Hyderabad',
    hostName: 'Mirza & Fatima',
    pricePerNight: 2800,
    rating: 4.9,
    reviewCount: 88,
    maxGuests: 4,
    bedrooms: 2,
    amenities: ['High-speed Wi-Fi', 'Hyderabadi Breakfast', 'AC', 'Private Courtyard', 'Heritage Library'],
    description: 'Restored 1920s Indo-Saracenic mansion nestled in a quiet lane near Banjara Hills. Handcrafted teak furniture with modern comforts.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    superhost: true
  },
  {
    id: 'stay-2',
    title: 'Lakeview Skyline Studio',
    city: 'Hyderabad',
    hostName: 'Sunita Reddy',
    pricePerNight: 2200,
    rating: 4.8,
    reviewCount: 114,
    maxGuests: 2,
    bedrooms: 1,
    amenities: ['Balcony Lake View', 'Kitchenette', 'High-speed Wi-Fi', 'Swimming Pool Access', 'Gym'],
    description: 'Chic modern high-rise apartment on Necklace Road overlooking Hussain Sagar. Ideal for digital nomads and weekend explorers.',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    superhost: true
  },
  {
    id: 'stay-3',
    title: 'Cyber Enclave Garden Cottage',
    city: 'Hyderabad',
    hostName: 'Rohan Sharma',
    pricePerNight: 1950,
    rating: 4.7,
    reviewCount: 65,
    maxGuests: 3,
    bedrooms: 1,
    amenities: ['Workstation & Ergonomic Chair', 'Organic Terrace Garden', 'Wi-Fi 300 Mbps', 'Kitchen'],
    description: 'Lush green sanctuary minutes away from HITEC City and financial district. Quiet atmosphere with birds chirping and fresh home breakfast.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    superhost: false
  },
  {
    id: 'stay-4',
    title: 'Old City Artisans Haveli',
    city: 'Hyderabad',
    hostName: 'Zainab Begum',
    pricePerNight: 3200,
    rating: 4.95,
    reviewCount: 42,
    maxGuests: 6,
    bedrooms: 3,
    amenities: ['Traditional Zari Workshop Walk', 'Rooftop Charminar View', 'Full Kitchen', 'AC', 'Chai Bar'],
    description: 'Stay in a living piece of Hyderabad heritage. Rooftop views directly facing Charminar minarets lit up in the evening.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    superhost: true
  }
];

export const tourismProducts: TourismProduct[] = [
  {
    id: 'prod-1',
    title: 'Heritage Walking & Irani Chai Trail',
    category: 'Guided Tour',
    price: 650,
    duration: '3 hours',
    rating: 4.9,
    description: 'Expert-led morning heritage walk winding through centuries-old alleys, sampling Osmania biscuits and authentic brewed Irani Chai.',
    included: ['Local Guide', 'Chai & Snacks', 'Monuments Entry Fee', 'Heritage Map Guide'],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-2',
    title: 'Fortress Acoustic & Night Light Pass',
    category: 'Attraction Pass',
    price: 450,
    duration: '4 hours',
    rating: 4.8,
    description: 'Combo fast-track pass to Golconda Fort acoustic exploration, royal gardens, and reserved seating for the Sound & Light evening spectacle.',
    included: ['Fast-track Ticket', 'Audio Guide Headset', 'Reserved Front Row Seating'],
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-3',
    title: 'Royal Nizam Culinary Masterclass',
    category: 'Experience',
    price: 1800,
    duration: '3.5 hours',
    rating: 4.95,
    description: 'Hands-on dum pukht biryani cooking workshop with a 3rd-generation royal khansama (master chef) in an antique courtyard.',
    included: ['All Cooking Ingredients', 'Full 4-Course Feast', 'Recipe Book Signed', 'Apron Souvenir'],
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80'
  }
];

// CLEARLY LABELED DEMO DATA: Baseline capacity progression
export const demoTestRun: TestRunReport = {
  id: 'run-demo-baseline-01',
  name: 'Standard Capacity Progression (4-Stage)',
  source: 'DEMO',
  testedUrl: 'https://tourist-capacity-demo.azurewebsites.net',
  endpointTested: 'GET /api/tourist-places, GET /api/homestays, GET /api/search?q=hyderabad',
  executedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  thresholds: {
    avgResponseTimeMs: 1000,
    errorRatePercent: 5.0,
    cpuWarningPercent: 80.0,
    memoryWarningPercent: 80.0
  },
  dataPoints: [
    {
      virtualUsers: 10,
      totalRequests: 2400,
      requestsPerSecond: 40.2,
      avgResponseTimeMs: 145,
      p90ResponseTimeMs: 190,
      p95ResponseTimeMs: 230,
      errorRatePercent: 0.0,
      cpuPercent: 24.5,
      memoryPercent: 38.2,
      testDurationSeconds: 60,
      status: 'PASS'
    },
    {
      virtualUsers: 25,
      totalRequests: 5850,
      requestsPerSecond: 97.5,
      avgResponseTimeMs: 230,
      p90ResponseTimeMs: 310,
      p95ResponseTimeMs: 380,
      errorRatePercent: 0.2,
      cpuPercent: 42.1,
      memoryPercent: 46.0,
      testDurationSeconds: 60,
      status: 'PASS'
    },
    {
      virtualUsers: 50,
      totalRequests: 11200,
      requestsPerSecond: 186.7,
      avgResponseTimeMs: 520,
      p90ResponseTimeMs: 740,
      p95ResponseTimeMs: 890,
      errorRatePercent: 1.1,
      cpuPercent: 68.4,
      memoryPercent: 58.7,
      testDurationSeconds: 60,
      status: 'PASS'
    },
    {
      virtualUsers: 100,
      totalRequests: 17800,
      requestsPerSecond: 296.6,
      avgResponseTimeMs: 1420,
      p90ResponseTimeMs: 1980,
      p95ResponseTimeMs: 2450,
      errorRatePercent: 6.8,
      cpuPercent: 89.2,
      memoryPercent: 82.5,
      testDurationSeconds: 60,
      status: 'INVESTIGATE'
    }
  ],
  summary: {
    maxSafeVirtualUsers: 50,
    peakRps: 296.6,
    avgLatencyMs: 578.75,
    overallErrorRate: 2.02
  }
};
