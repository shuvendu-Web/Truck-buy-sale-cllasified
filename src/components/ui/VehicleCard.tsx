import React, { useState, useMemo } from 'react';
import { Vehicle } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  Heart, 
  MapPin, 
  Gauge, 
  Fuel, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Calculator,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { EmiCalculatorModal } from './EmiCalculatorModal';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
  onSelect?: (vehicle: Vehicle) => void;
  showAdminActions?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  viewMode = 'grid', 
  onSelect,
}) => {
  const { isFavorite, toggleFavorite, settings } = useMarketplace();
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const favorited = isFavorite(vehicle.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedKm = new Intl.NumberFormat('en-IN').format(vehicle.kmDriven);

  // Calculate monthly EMI (e.g. ₹16,085 / m)
  const monthlyEmi = useMemo(() => {
    const rate = settings?.emiBanks?.[0]?.annualInterestRate || 8.5;
    const loan = vehicle.price * 0.8;
    const r = rate / 12 / 100;
    const n = 60;
    if (r === 0) return Math.round(loan / n);
    const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }, [vehicle.price, settings]);

  if (viewMode === 'list') {
    return (
      <>
        <div 
          onClick={() => onSelect?.(vehicle)}
          className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 p-4 flex flex-col md:flex-row gap-5 cursor-pointer overflow-hidden"
        >
          {/* Image */}
          <div className="relative w-full md:w-72 h-52 shrink-0 rounded-xl overflow-hidden bg-slate-100">
            <img 
              src={vehicle.featuredImage || vehicle.images[0]} 
              alt={vehicle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            {vehicle.featured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(vehicle.id);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
                favorited 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
              }`}
              title={favorited ? 'Remove from Saved' : 'Save Vehicle'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {vehicle.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition mt-1.5 line-clamp-1">
                    {vehicle.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xl font-extrabold text-blue-600 tracking-tight">
                      {formattedPrice}
                    </span>
                    {/* Green EMI Button in list mode */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmiModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition flex items-center gap-1 cursor-pointer"
                      title="Calculate EMI Loan"
                    >
                      <Calculator className="w-3 h-3" />
                      <span>₹{monthlyEmi.toLocaleString('en-IN')}/m</span>
                    </button>
                  </div>
                  {vehicle.negotiable && (
                    <span className="block text-[11px] text-slate-400 font-medium">Negotiable</span>
                  )}
                </div>
              </div>

              {/* Spec tags */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <Fuel className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <Gauge className="w-3.5 h-3.5 text-amber-500" />
                  <span>{formattedKm} km</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <span>{vehicle.transmission}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{vehicle.location.city}, {vehicle.location.state}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  {vehicle.sellerInfo.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>{vehicle.sellerInfo.sellerType}</span>
                </div>
                <button 
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition cursor-pointer"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EMI Calculator Modal */}
        <EmiCalculatorModal
          vehicle={vehicle}
          isOpen={emiModalOpen}
          onClose={() => setEmiModalOpen(false)}
        />
      </>
    );
  }

  // Grid layout (default matching reference design)
  return (
    <>
      <div 
        onClick={() => onSelect?.(vehicle)}
        className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      >
        {/* Top Image */}
        <div className="relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden">
          <img 
            src={vehicle.featuredImage || vehicle.images[0]} 
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {vehicle.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </div>
          )}

          {vehicle.status !== 'approved' && vehicle.status !== 'published' && (
            <div className="absolute top-3 left-3">
              <StatusBadge status={vehicle.status} size="sm" />
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(vehicle.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
              favorited 
                ? 'bg-rose-500 text-white scale-110' 
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
            title={favorited ? 'Remove from Saved' : 'Save Vehicle'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>

          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span className="truncate max-w-[160px]">{vehicle.location.city}, {vehicle.location.state}</span>
          </div>
        </div>

        {/* Body Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-blue-600 uppercase tracking-wider text-[11px]">
                {vehicle.brandName} • {vehicle.category}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-400">
                {vehicle.sellerInfo.sellerType}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
              {vehicle.title}
            </h3>

            {/* Quick specs pill row */}
            <div className="grid grid-cols-3 gap-1.5 mt-3 text-center text-xs">
              <div className="bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-1">
                <span className="block text-[10px] text-slate-400 font-medium">Year</span>
                <span className="font-bold text-slate-700">{vehicle.year}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-1">
                <span className="block text-[10px] text-slate-400 font-medium">Fuel</span>
                <span className="font-bold text-slate-700 truncate">{vehicle.fuelType}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-1">
                <span className="block text-[10px] text-slate-400 font-medium">Driven</span>
                <span className="font-bold text-slate-700 truncate">{formattedKm} km</span>
              </div>
            </div>
          </div>

          {/* Price & Action Buttons (Price on Top, 2 Buttons Middle-Aligned Below) */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5">
            {/* Top: Prominent Full Price */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Price</span>
                <span className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight block">
                  {formattedPrice}
                </span>
              </div>
              {vehicle.negotiable && (
                <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
                  Negotiable
                </span>
              )}
            </div>

            {/* Bottom: 2 Buttons Middle-Aligned Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Green (price/M) EMI Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEmiModalOpen(true);
                }}
                className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs hover:shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                title="Click to calculate EMI for this vehicle"
              >
                <Calculator className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">₹{monthlyEmi.toLocaleString('en-IN')}/m</span>
              </button>

              {/* Details Button */}
              <button 
                type="button"
                className="w-full py-2 px-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EMI Calculator Modal */}
      <EmiCalculatorModal
        vehicle={vehicle}
        isOpen={emiModalOpen}
        onClose={() => setEmiModalOpen(false)}
      />
    </>
  );
};
