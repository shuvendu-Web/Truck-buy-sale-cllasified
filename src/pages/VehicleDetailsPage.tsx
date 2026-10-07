import React, { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotification } from '../context/NotificationContext';
import { ImageGallery } from '../components/ui/ImageGallery';
import { InterestModal } from '../components/ui/InterestModal';
import { EmiCalculatorModal } from '../components/ui/EmiCalculatorModal';
import { ReportModal } from '../components/ui/ReportModal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { VehicleCard } from '../components/ui/VehicleCard';
import { 
  Heart, 
  Share2, 
  Flag, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Gauge, 
  Fuel, 
  Sparkles, 
  User, 
  Clock, 
  Info,
  ChevronRight,
  ExternalLink,
  Lock,
  Calculator,
  Building2,
  Percent,
  Check
} from 'lucide-react';

interface VehicleDetailsPageProps {
  vehicleId: string;
  onNavigate: (path: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const VehicleDetailsPage: React.FC<VehicleDetailsPageProps> = ({
  vehicleId,
  onNavigate,
  onSelectVehicle,
}) => {
  const { getVehicleById, isFavorite, toggleFavorite, publishedVehicles, sendMessage, settings } = useMarketplace();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const vehicle = getVehicleById(vehicleId);

  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Calculate lowest estimated EMI
  const estimatedEmi = useMemo(() => {
    if (!vehicle) return 0;
    const lowestRate = settings?.emiBanks?.[0]?.annualInterestRate || 8.5;
    const loan = vehicle.price * 0.8;
    const r = lowestRate / 12 / 100;
    const n = 60;
    if (r === 0) return Math.round(loan / n);
    const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }, [vehicle, settings]);

  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Vehicle Not Found</h2>
        <p className="text-sm text-slate-500">The vehicle you are looking for might have been sold or removed.</p>
        <button
          onClick={() => onNavigate('/vehicles')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm"
        >
          Browse All Vehicles
        </button>
      </div>
    );
  }

  const favorited = isFavorite(vehicle.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedKm = new Intl.NumberFormat('en-IN').format(vehicle.kmDriven);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('info', 'Link Copied!', 'Vehicle listing link copied to clipboard.');
  };

  const handleSendQuickMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;

    if (!isAuthenticated) {
      showToast('info', 'Please Sign In', 'Sign in to send direct in-app messages to the seller.');
      return;
    }

    setSendingMsg(true);
    try {
      await sendMessage(null, quickMessage, vehicle.sellerId, vehicle.id);
      setQuickMessage('');
    } finally {
      setSendingMsg(false);
    }
  };

  const relatedVehicles = publishedVehicles
    .filter(v => v.id !== vehicle.id && (v.category === vehicle.category || v.brandId === vehicle.brandId))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => onNavigate('/vehicles')} className="hover:text-blue-600">Vehicles</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600">{vehicle.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{vehicle.brandName} {vehicle.model}</span>
      </nav>

      {/* Seller Card Extracted for Responsive Positioning */}
      {(() => {
        const sellerCard = (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Listed By</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                {vehicle.sellerInfo.sellerType}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={vehicle.sellerInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${vehicle.sellerInfo.name}`}
                alt={vehicle.sellerInfo.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-slate-900">{vehicle.sellerInfo.name}</h3>
                  {vehicle.sellerInfo.isVerified && (
                    <span title="Verified Seller">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Member since {vehicle.sellerInfo.memberSince || '2024'}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>Responds {vehicle.sellerInfo.responseRate || 'within 1 hour'}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons: Submit Interest, Reveal Phone, and Green Easy EMI button */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setInterestModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Buyer Interest</span>
              </button>

              {/* Call Seller / Admin Helpline Toggle */}
              {showPhone ? (
                <div className="space-y-1.5">
                  <a
                    href={`tel:${settings?.adminContactNumber || '+91 98301 23456'}`}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex items-center justify-between transition shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>{settings?.adminContactNumber || '+91 98301 23456'}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">
                      Admin Helpline
                    </span>
                  </a>
                  <span className="block text-[10px] text-center text-slate-400">
                    SatyaDeal Verified Helpline Desk (Set by Admin)
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setShowPhone(true)}
                  className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Reveal Phone Number</span>
                </button>
              )}

              {/* Green Easy EMI Button: Click to Open EMI Calculator */}
              <button
                type="button"
                onClick={() => setEmiModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg transition flex items-center justify-between gap-2 cursor-pointer group transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-105 transition">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <span>Easy EMI</span>
                </div>
                <div className="flex items-baseline gap-1 bg-black/20 px-3 py-1 rounded-lg">
                  <span className="text-base font-black tracking-tight">₹{estimatedEmi.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-emerald-100 font-bold">/ m</span>
                </div>
              </button>
            </div>

            {/* Direct Message */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Direct Message</span>
                <span className="text-[10px] text-slate-400 font-normal">Chat directly with seller</span>
              </label>
              <form onSubmit={handleSendQuickMessage} className="space-y-2">
                <textarea
                  rows={2}
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  placeholder={`Type your question for ${vehicle.sellerInfo.name}...`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="submit"
                  disabled={sendingMsg || !quickMessage.trim()}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{sendingMsg ? 'Sending...' : 'Send Direct Message'}</span>
                </button>
              </form>
            </div>

            {/* SatyaDeal Trust Guarantee Badge */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SatyaDeal Safe Trade Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Always meet in a well-lit public area. Verify physical vehicle documents before initiating bank transfers.
              </p>
            </div>
          </div>
        );

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-8">
          
          {/* Gallery Component */}
          <ImageGallery images={vehicle.images} title={vehicle.title} />

          {/* Title, Price & Quick Actions Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                    {vehicle.brandName} • {vehicle.category}
                  </span>
                  <StatusBadge status={vehicle.status} size="sm" />
                  {vehicle.featured && (
                    <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {vehicle.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{vehicle.location.area}, {vehicle.location.city}, {vehicle.location.state}</span>
                  <span>•</span>
                  <span>Listed {new Date(vehicle.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Price */}
              <div className="sm:text-right">
                <span className="text-3xl font-black text-blue-600 tracking-tight">
                  {formattedPrice}
                </span>
                {vehicle.negotiable && (
                  <span className="block text-xs text-slate-400 font-medium mt-0.5">Price Negotiable</span>
                )}
              </div>
            </div>

            {/* Quick action icons row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(vehicle.id)}
                  className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 font-bold transition shadow-xs ${
                    favorited
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
                  <span>{favorited ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Share</span>
                </button>
              </div>

              <button
                onClick={() => setReportModalOpen(true)}
                className="text-slate-400 hover:text-rose-600 transition flex items-center gap-1 text-xs"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Listing</span>
              </button>
            </div>
          </div>

          {/* Mobile-only Seller Card (Visible only on small screens) */}
          <div className="block lg:hidden">
            {sellerCard}
          </div>

          {/* Vehicle Specifications Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Vehicle Specifications</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Make / Brand</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.brandName}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Model & Variant</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block truncate">{vehicle.model} {vehicle.variant}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Year of Mfg</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.year}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fuel Type</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.fuelType}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Transmission</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.transmission}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kilometers Driven</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{formattedKm} km</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Ownership</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.ownership}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Exterior Color</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.color}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Engine Spec</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block truncate">{vehicle.engine || 'Standard'}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle Condition</span>
                <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{vehicle.condition}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Insurance Status</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block truncate">{vehicle.insurance}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registration Number</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{vehicle.registrationNumber}</span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Seller's Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>

          {/* Location Map Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Vehicle Location</h2>
                <p className="text-xs text-slate-500">{vehicle.location.area}, {vehicle.location.city}, {vehicle.location.state} - {vehicle.location.pincode}</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Verified Area
              </span>
            </div>

            {/* Stylized Interactive Map Container */}
            <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                alt="Map representation"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[1px]" />
              <div className="relative z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{vehicle.title}</h4>
                  <span className="text-[11px] text-slate-500">{vehicle.location.city}, {vehicle.location.state}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Seller Contact & Express Interest (Visible only on desktop) */}
        <div className="hidden lg:block space-y-6 sticky top-24">
          {sellerCard}
        </div>
      </div>
      );
      })()}

      {/* Related Vehicles Section */}
      {relatedVehicles.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Similar Vehicles You Might Like</h2>
              <p className="text-xs text-slate-500">More deals in {vehicle.category}s</p>
            </div>
            <button
              onClick={() => onNavigate('/vehicles')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Browse All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedVehicles.map((rel) => (
              <VehicleCard
                key={rel.id}
                vehicle={rel}
                onSelect={onSelectVehicle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Interest Submission Modal */}
      <InterestModal
        vehicle={vehicle}
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
      />

      {/* EMI Loan Calculator & Application Modal */}
      <EmiCalculatorModal
        vehicle={vehicle}
        isOpen={emiModalOpen}
        onClose={() => setEmiModalOpen(false)}
      />

      {/* Flag / Report Listing Modal */}
      <ReportModal
        vehicle={vehicle}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
