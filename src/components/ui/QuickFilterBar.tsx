import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, SlidersHorizontal, ArrowRight, RotateCcw } from 'lucide-react';

interface QuickFilterBarProps {
  onSearchSubmit?: () => void;
  compact?: boolean;
}

export const QuickFilterBar: React.FC<QuickFilterBarProps> = ({ onSearchSubmit, compact = false }) => {
  const { filters, setFilters, brands, locations, categories, resetFilters } = useMarketplace();

  // Dynamic tabs customized by admin panel
  const CATEGORY_TABS = [
    { label: 'All Vehicles', value: 'All' },
    ...categories.map(c => ({
      label: c.name === 'Other' ? 'Others' : (c.name.endsWith('s') ? c.name : c.name + 's'),
      value: c.name
    }))
  ];
  const [activeTab, setActiveTab] = useState<string>(filters.category || 'All');

  const formatPrice = (value: number | null | undefined) => {
    if (!value) return 'Any Price';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2).replace('.00', '')} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2).replace('.00', '')} Lakh`;
    return `₹${value.toLocaleString()}`;
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setFilters(prev => ({ ...prev, category: val }));
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearchSubmit?.();
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 max-w-5xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-white/10 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.value
                ? 'bg-green-600 text-white shadow-md shadow-green-500/25 scale-[1.02]'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <form onSubmit={handleSearch} className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Brand Select */}
          <div>
            <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
            >
              <option className="text-slate-900 bg-white" value="All">All Brands</option>
              {brands.map(b => (
                <option className="text-slate-900 bg-white" key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Location Select */}
          <div>
            <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">Location</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
            >
              <option className="text-slate-900 bg-white" value="All">All Locations</option>
              {locations.map(loc => (
                <option className="text-slate-900 bg-white" key={loc.id} value={loc.name}>{loc.name}, {loc.state}</option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">Fuel Type</label>
            <select
              value={filters.fuelType}
              onChange={(e) => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
            >
              <option className="text-slate-900 bg-white" value="All">Any Fuel</option>
              <option className="text-slate-900 bg-white" value="Petrol">Petrol</option>
              <option className="text-slate-900 bg-white" value="Diesel">Diesel</option>
              <option className="text-slate-900 bg-white" value="Electric">Electric</option>
              <option className="text-slate-900 bg-white" value="Hybrid">Hybrid</option>
              <option className="text-slate-900 bg-white" value="CNG">CNG</option>
            </select>
          </div>

          {/* Max Budget */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider">Budget Range</label>
              <span className="text-[11px] font-bold text-green-400">
                {formatPrice(filters.maxPrice)}
              </span>
            </div>
            <div className="px-1 pt-2 pb-1 flex flex-col">
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={filters.maxPrice || 10000000}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFilters(prev => ({ ...prev, maxPrice: val === 10000000 ? null : val }));
                }}
                className="w-full accent-green-500 h-1.5 rounded-lg appearance-none cursor-pointer relative z-10"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${(((filters.maxPrice || 10000000) - 100000) / (10000000 - 100000)) * 100}%, rgba(255,255,255,0.2) ${(((filters.maxPrice || 10000000) - 100000) / (10000000 - 100000)) * 100}%)`
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] font-bold text-green-400 tracking-wider">1 LAKH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Action Bar */}
        <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search make, model, Swift, Creta..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={resetFilters}
              className="p-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/70 transition text-xs font-semibold flex items-center gap-1"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Vehicles
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
