import React, { useState } from 'react';
import { X, Calendar, User, Mail, Phone, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { TouristPlace, Homestay, TourismProduct, BookingResponse } from '../../types';

interface BookingModalProps {
  item: TouristPlace | Homestay | TourismProduct | null;
  itemType: 'place' | 'homestay' | 'product';
  onClose: () => void;
  onBookingSuccess: (booking: BookingResponse) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  item,
  itemType,
  onClose,
  onBookingSuccess
}) => {
  if (!item) return null;

  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);

  // Price calculations
  let unitPrice = 0;
  let title = '';
  if (itemType === 'homestay') {
    const stay = item as Homestay;
    unitPrice = stay.pricePerNight;
    title = stay.title;
  } else if (itemType === 'place') {
    const place = item as TouristPlace;
    unitPrice = place.entryFee;
    title = place.name;
  } else {
    const prod = item as TourismProduct;
    unitPrice = prod.price;
    title = prod.title;
  }

  const calculatedTotal = unitPrice * guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          email,
          phone,
          targetId: item.id,
          targetType: itemType,
          targetTitle: title,
          checkInDate,
          checkOutDate: itemType === 'homestay' ? checkOutDate : undefined,
          guests,
          specialRequests
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setConfirmedBooking(data.data);
      onBookingSuccess(data.data);
    } catch (err: any) {
      setError(err.message || 'Network error submitting booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Booking Confirmed!</h3>
            <p className="text-sm text-slate-400 mb-6">
              Confirmation code sent to your email.
            </p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left mb-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                <span>Confirmation ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{confirmedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Experience / Stay:</span>
                <span className="text-slate-200 font-medium text-right">{confirmedBooking.targetTitle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Guest Name:</span>
                <span className="text-slate-200">{confirmedBooking.guestName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-200">{confirmedBooking.checkInDate}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-800/80 pt-2 font-bold text-white">
                <span>Total Paid (Simulated):</span>
                <span className="text-sky-400">₹{confirmedBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/30"
            >
              Done & Return to Catalogue
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Booking Form • POST /api/bookings</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-xs text-slate-400 mb-5">
              Fills real database records and provides simulated booking receipts for load-testing evaluation.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Vikramaditya Verma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {itemType === 'homestay' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Checkout</label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Slot</label>
                    <select className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500">
                      <option>Morning (09:30 AM)</option>
                      <option>Afternoon (02:00 PM)</option>
                      <option>Evening (05:00 PM)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Need vegetarian breakfast, airport cab pickup, wheelchair assistance..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Rate</span>
                  <span className="text-xs text-slate-500">₹{unitPrice} x {guests} {guests > 1 ? 'guests' : 'guest'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-sky-400">₹{calculatedTotal.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 block">Taxes included</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
