import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { VehicleCard } from '../components/ui/VehicleCard';
import { QuickFilterBar } from '../components/ui/QuickFilterBar';
import AuroraText from '../components/ui/AuroraText';
import { TestimonialSection } from '../components/ui/TestimonialSection';
import { 
  Car, 
  ShieldCheck, 
  UserCheck, 
  PhoneCall, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  BadgeCheck,
  ChevronRight,
  Clock,
  Award
} from 'lucide-react';
import { Vehicle } from '../types';
import heroBg from '../assets/hero-truck.jpg';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectVehicle }) => {
  const { featuredVehicles, publishedVehicles, categories, brands, setFilters } = useMarketplace();
  const { isAuthenticated } = useAuth();

  const handleCategoryClick = (categoryName: string) => {
    setFilters(prev => ({ ...prev, category: categoryName }));
    onNavigate('/vehicles');
  };

  const handleBrandClick = (brandName: string) => {
    setFilters(prev => ({ ...prev, brand: brandName }));
    onNavigate('/vehicles');
  };

  const latestVehicles = publishedVehicles.slice(0, 4);

  return (
    <div className="pb-16">
      
      {/* Hero Section with Image Background */}
      <section 
        className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-slate-200/40"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark opacity overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-xs text-xs font-bold text-green-300">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              <span>India's Premium Classified Auto Marketplace</span>
            </div>

            <AuroraText className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-4" />

            <p className="text-base sm:text-lg text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Find the best deals on verified cars, bikes, trucks and SUVs. Safe, simple, and direct owner connections with 0% middleman commission.
            </p>
          </div>

          {/* Dynamic Search & Filter Module */}
          <div className="relative">
            <QuickFilterBar onSearchSubmit={() => onNavigate('/vehicles')} />
          </div>

          {/* Trust Highlights Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Verified Listings</h4>
                <p className="text-[11px] text-slate-500">Super Admin checked</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Direct Owner</h4>
                <p className="text-[11px] text-slate-500">No agent markups</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Instant Contact</h4>
                <p className="text-[11px] text-slate-500">Call, WhatsApp & Chat</p>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Wide Selection</h4>
                <p className="text-[11px] text-slate-500">Cars, bikes & trucks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="bg-green-50 py-12 border-y border-green-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Handpicked Deals
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Vehicles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top-rated vehicles inspected and certified by trusted sellers
            </p>
          </div>

          <button
            onClick={() => onNavigate('/vehicles')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 text-xs sm:text-sm font-bold shadow-xs transition"
          >
            <span>View All Vehicles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={onSelectVehicle}
            />
          ))}
        </div>
        </div>
      </section>

      {/* Vehicle Categories Grid */}
      <section className="bg-blue-50 py-12 border-y border-blue-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Explore by Body Type</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Vehicle Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50/80 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-all duration-300 mb-3 shadow-xs">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                {cat.name}s
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
                ({cat.listingCount.toLocaleString()} listings)
              </span>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      <div className="space-y-16 pt-16">
      {/* Promotional Sell Your Vehicle Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 text-white p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-100">
                100% Free Listing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Sell Your Vehicle & Get the Best Price
              </h2>
              <p className="text-sm text-blue-100 leading-relaxed max-w-lg">
                Reach thousands of genuine verified buyers across India looking for vehicles like yours. No hidden fees or middleman commissions.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('/dashboard/listings/new')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-sm shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Sell Your Vehicle Now
                </button>
                <button
                  onClick={() => onNavigate('/vehicles')}
                  className="px-6 py-3.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/30 transition"
                >
                  Browse Marketplace
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
                alt="Sell vehicle"
                className="rounded-2xl shadow-2xl object-cover h-64 w-full transform rotate-1 hover:rotate-0 transition duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Brands & Manufacturers
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore vehicles by certified top automakers</p>
          </div>
          <button
            onClick={() => onNavigate('/brands')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All Brands</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition text-center cursor-pointer flex flex-col items-center justify-center space-y-2 group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 max-w-[100px] object-contain group-hover:scale-105 transition"
              />
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                {brand.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {brand.listingCount} vehicles
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Instant EMI & Auto Loan Financing Showcase (30% Green Highlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-950 text-white p-8 sm:p-10 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="lg:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>SatyaDeal Easy Finance Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Instant Auto Loan & Low EMI from 8.5% p.a.
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
                Get pre-approved vehicle loans across HDFC, SBI, ICICI, Axis and Kotak Mahindra. 
                Zero hidden charges, flexible tenure up to 84 months, and instant sanction lead to Super Admin.
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="bg-white/10 text-emerald-200 border border-emerald-400/20 text-[11px] font-bold px-3 py-1 rounded-xl">
                  ✓ 10% Min Down Payment
                </span>
                <span className="bg-white/10 text-emerald-200 border border-emerald-400/20 text-[11px] font-bold px-3 py-1 rounded-xl">
                  ✓ Same-day Digital Approval
                </span>
                <span className="bg-white/10 text-emerald-200 border border-emerald-400/20 text-[11px] font-bold px-3 py-1 rounded-xl">
                  ✓ Multiple Partner Banks
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3 text-center lg:text-left">
              <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider block">
                Calculated on Every Vehicle
              </span>
              <div className="text-3xl font-black text-white">
                ₹5,400 <span className="text-sm font-normal text-emerald-300">/ month*</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Explore any vehicle on SatyaDeal to see customized EMI plans and submit your contact number.
              </p>
              <button
                onClick={() => onNavigate('/vehicles')}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Vehicles with EMI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Latest Published Listings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Recently verified by Super Admin</p>
          </div>
          <button
            onClick={() => onNavigate('/vehicles')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Browse All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={onSelectVehicle}
            />
          ))}
        </div>
      </section>
      </div>
    </div>
  );
};
