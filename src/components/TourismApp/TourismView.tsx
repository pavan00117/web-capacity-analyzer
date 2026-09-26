import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Home,
  Compass,
  Users,
  Check,
  Tag,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { TouristPlace, Homestay, TourismProduct, BookingResponse } from '../../types';
import { BookingModal } from './BookingModal';

export const TourismView: React.FC = () => {
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [products, setProducts] = useState<TourismProduct[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'places' | 'homestays' | 'tours'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Booking Modal State
  const [selectedItem, setSelectedItem] = useState<TouristPlace | Homestay | TourismProduct | null>(null);
  const [selectedType, setSelectedType] = useState<'place' | 'homestay' | 'product'>('place');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [placesRes, staysRes, prodRes, bookRes] = await Promise.all([
        fetch('/api/tourist-places'),
        fetch('/api/homestays'),
        fetch('/api/products'),
        fetch('/api/bookings')
      ]);

      const [placesData, staysData, prodData, bookData] = await Promise.all([
        placesRes.json(),
        staysRes.json(),
        prodRes.json(),
        bookRes.json()
      ]);

      if (placesData.success) setPlaces(placesData.data);
      if (staysData.success) setHomestays(staysData.data);
      if (prodData.success) setProducts(prodData.data);
      if (bookData.success) setRecentBookings(bookData.data);
    } catch (err) {
      console.error('Error fetching tourism data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Live search handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchData();
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.results) {
        setPlaces(data.results.places || []);
        setHomestays(data.results.homestays || []);
        setProducts(data.results.products || []);
      }
    } catch (err) {
      console.error('Error during search:', err);
    }
  };

  const openBooking = (item: TouristPlace | Homestay | TourismProduct, type: 'place' | 'homestay' | 'product') => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: BookingResponse) => {
    setRecentBookings(prev => [newBooking, ...prev]);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Target Web Application for Azure Load Testing</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Hyderabad Heritage & Homestays
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            A production-ready tourism platform backed by real Express REST APIs. This application serves as the real workload target for evaluating concurrent capacity under Azure Load Testing.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search places, homestays, or tours (e.g. 'Charminar', 'Villa', 'Biryani')..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 backdrop-blur border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 shadow-lg text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3.5 top-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick API Endpoints Badge List */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium">Live Under-Test Endpoints:</span>
          <a
            href="/api/tourist-places"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-sky-300 font-mono"
          >
            GET /api/tourist-places
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/api/homestays"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-sky-300 font-mono"
          >
            GET /api/homestays
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/api/search?q=hyderabad"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-sky-300 font-mono"
          >
            GET /api/search?q=hyderabad
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-emerald-300 font-mono"
          >
            GET /api/health
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Experiences ({places.length + homestays.length + products.length})
          </button>
          <button
            onClick={() => setActiveCategory('places')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === 'places'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tourist Places ({places.length})
          </button>
          <button
            onClick={() => setActiveCategory('homestays')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === 'homestays'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Homestays ({homestays.length})
          </button>
          <button
            onClick={() => setActiveCategory('tours')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === 'tours'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Guided Tours ({products.length})
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Showing real JSON results from server controllers
        </span>
      </div>

      {/* 1. Tourist Places Grid */}
      {(activeCategory === 'all' || activeCategory === 'places') && places.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              Must-Visit Heritage & Tourist Places
            </h2>
            <span className="text-xs text-slate-400">Endpoint: GET /api/tourist-places</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-400 flex items-center gap-1 border border-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{place.rating}</span>
                    <span className="text-slate-500">({place.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {place.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{place.city}</span>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{place.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{place.description}</p>

                    <div className="space-y-1 mb-4">
                      {place.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Entry Fee</span>
                      <span className="text-base font-bold text-white">₹{place.entryFee}</span>
                    </div>
                    <button
                      onClick={() => openBooking(place, 'place')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-md shadow-blue-600/20"
                    >
                      <span>Book Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Homestays Grid */}
      {(activeCategory === 'all' || activeCategory === 'homestays') && homestays.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-400" />
              Verified Heritage Homestays & Suites
            </h2>
            <span className="text-xs text-slate-400">Endpoint: GET /api/homestays</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homestays.map((stay) => (
              <div
                key={stay.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={stay.imageUrl}
                    alt={stay.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {stay.superhost && (
                    <div className="absolute top-3 left-3 bg-amber-500/90 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3 h-3" />
                      Superhost
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded text-xs font-semibold text-sky-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{stay.rating}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base mb-1 line-clamp-1">{stay.title}</h3>
                    <p className="text-xs text-slate-400 mb-2">Hosted by {stay.hostName}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        Up to {stay.maxGuests} guests
                      </span>
                      <span>•</span>
                      <span>{stay.bedrooms} {stay.bedrooms > 1 ? 'beds' : 'bed'}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {stay.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-white">₹{stay.pricePerNight}</span>
                      <span className="text-xs text-slate-500"> / night</span>
                    </div>
                    <button
                      onClick={() => openBooking(stay, 'homestay')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Guided Experiences Grid */}
      {(activeCategory === 'all' || activeCategory === 'tours') && products.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              Guided Tours & Nizam Experiences
            </h2>
            <span className="text-xs text-slate-400">Endpoint: GET /api/products</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      {prod.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {prod.duration}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{prod.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{prod.description}</p>

                  <div className="space-y-1 mb-4">
                    {prod.included.map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-lg font-bold text-white">
                    ₹{prod.price} <span className="text-xs text-slate-400 font-normal">/ person</span>
                  </div>
                  <button
                    onClick={() => openBooking(prod, 'product')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Book Experience
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Bookings Feed (Demonstrating POST /api/bookings) */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-white text-base">Recent Confirmed Bookings Feed</h3>
          </div>
          <span className="text-xs text-slate-400">
            Backed by in-memory persistence & validation
          </span>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No bookings made yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentBookings.slice(0, 3).map((bk) => (
              <div key={bk.bookingId} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                <div className="flex justify-between font-mono text-emerald-400 font-bold mb-1">
                  <span>{bk.bookingId}</span>
                  <span className="text-slate-400 font-normal font-sans">₹{bk.totalAmount}</span>
                </div>
                <div className="text-white font-medium truncate mb-1">{bk.targetTitle}</div>
                <div className="text-slate-400 flex justify-between">
                  <span>{bk.guestName}</span>
                  <span>{bk.checkInDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          item={selectedItem}
          itemType={selectedType}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};
