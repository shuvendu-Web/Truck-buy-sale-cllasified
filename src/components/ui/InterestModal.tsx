import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, Send, ShieldCheck, Phone, MessageSquare, Mail, Sparkles, User, MapPin } from 'lucide-react';

interface InterestModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const InterestModal: React.FC<InterestModalProps> = ({ vehicle, isOpen, onClose }) => {
  const { user } = useAuth();
  const { submitInterest } = useMarketplace();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.city ? `${user.city}` : 'Kolkata');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone Call' | 'Email'>('WhatsApp');
  const [message, setMessage] = useState(`Hi ${vehicle.sellerInfo.name}, I am interested in your ${vehicle.title}. Please contact me.`);
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !agreed) return;

    setSubmitting(true);
    try {
      await submitInterest({
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        vehicleImage: vehicle.featuredImage || vehicle.images[0],
        vehiclePrice: vehicle.price,
        sellerId: vehicle.sellerId,
        buyerId: user?.id,
        buyerName: name,
        buyerPhone: phone,
        buyerEmail: user?.email || '',
        buyerLocation: location,
        preferredContact,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header with Vehicle Pill */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 block leading-tight">
                Express Buyer Interest
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Submit Inquiry Request
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Vehicle Strip */}
        <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={vehicle.featuredImage || vehicle.images[0]}
              alt={vehicle.title}
              className="w-10 h-8 object-cover rounded-lg border border-blue-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-xs truncate max-w-[200px]">{vehicle.title}</h4>
              <span className="text-[10px] text-slate-500">{vehicle.location.city} • Seller: {vehicle.sellerInfo.name}</span>
            </div>
          </div>
          <span className="font-black text-blue-600 shrink-0">{formattedPrice}</span>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Inquiry Sent to Admin & Seller!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Your contact request was registered. <span className="font-semibold text-slate-800">{vehicle.sellerInfo.name}</span> and the admin desk will connect with you via {preferredContact}.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 text-xs">
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Das"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Number *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98300 12345"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-blue-300 bg-blue-50/30 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Location & Preferred mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your City / Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kolkata"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Contact</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['WhatsApp', 'Phone Call', 'Email'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPreferredContact(method)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition text-center truncate ${
                        preferredContact === method
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {method === 'Phone Call' ? 'Call' : method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Short Message */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Message (Optional)</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about inspection or price..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>I agree to share contact info with the seller & admin desk.</span>
            </label>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={submitting || !agreed}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Buyer Interest'}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>SatyaDeal Secure Buyer Guarantee</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
