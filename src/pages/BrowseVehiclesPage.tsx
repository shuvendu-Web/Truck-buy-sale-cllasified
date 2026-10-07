import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { VehicleCard } from '../components/ui/VehicleCard';
import { Vehicle } from '../types';
import { 
  SlidersHorizontal, 
  Grid, 
  List, 
  Search, 
  X, 
  RotateCcw, 
  ChevronDown, 
  Fuel, 
  Car, 
  MapPin, 
  Tag,
  Gauge
} from 'lucide-react';

interface BrowseVehiclesPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigate: (path: string) => void;
}

export const BrowseVehiclesPage: React.FC<BrowseVehiclesPageProps> = ({ 
  onSelectVehicle, 
  onNavigate 
}) => {
  const { 
    filteredVehicles, 
    filters, 
    setFilters, 
    resetFilters, 
    categories, 
    brands, 
    locations 
  } = useMarketplace();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = [
    filters.category !== 'All' && filters.category,
    filters.brand !== 'All' && filters.brand,
    filters.location !== 'All' && filters.location,
    filters.fuelType !== 'All' && filters.fuelType,
    filters.transmission !== 'All' && filters.transmission,
    filters.ownership !== 'All' && filters.ownership,
    filters.condition !== 'All' && filters.condition,
    filters.sellerType !== 'All' && filters.sellerType,
    filters.minPrice !== null,
    filters.maxPrice !== null,
    filters.search.trim(),
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Marketplace Inventory</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Used Vehicles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{filteredVehicles.length}</span> verified listings
          </p>
        </div>

        {/* Search Input in Top Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search make, model, or keywords..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFilterCount})</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Filter Sidebar (Desktop) */}
        <div className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Filters</h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Brand / Make</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City / Location</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Locations</option>
              {locations.map(l => (
                <option key={l.id} value={l.name}>{l.name}, {l.state}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : null }))}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value ? Number(e.target.value) : null }))}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fuel Type</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {['All', 'Petrol', 'Diesel', 'Electric', 'CNG'].map((fuel) => (
                <button
                  key={fuel}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, fuelType: fuel }))}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition text-left ${
                    filters.fuelType === fuel
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Transmission</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {['All', 'Manual', 'Automatic'].map((trans) => (
                <button
                  key={trans}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, transmission: trans }))}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition text-center ${
                    filters.transmission === trans
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>
          </div>

          {/* Ownership */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ownership</label>
            <select
              value={filters.ownership}
              onChange={(e) => setFilters(prev => ({ ...prev, ownership: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">Any Ownership</option>
              <option value="First Owner">First Owner</option>
              <option value="Second Owner">Second Owner</option>
              <option value="Third Owner">Third Owner</option>
            </select>
          </div>

          {/* Seller Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Seller Type</label>
            <select
              value={filters.sellerType}
              onChange={(e) => setFilters(prev => ({ ...prev, sellerType: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Sellers</option>
              <option value="Direct Owner">Direct Owner</option>
              <option value="Individual">Individual</option>
              <option value="Dealer">Dealer</option>
            </select>
          </div>
        </div>

        {/* Right Listing Results */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Controls Bar: Sort and Grid/List view toggle */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
            
            {/* Active filters pill list */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="relevance">Featured & Relevant</option>
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="views_desc">Most Viewed</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Grid / List */}
          {filteredVehicles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Vehicles Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                We couldn't find any vehicles matching your exact search filters. Try adjusting your price range, category, or location.
              </p>
              <div>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  viewMode={viewMode}
                  onSelect={onSelectVehicle}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-900">Filter Vehicles</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters items */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="All">All Brands</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                >
                  <option value="All">All Locations</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
