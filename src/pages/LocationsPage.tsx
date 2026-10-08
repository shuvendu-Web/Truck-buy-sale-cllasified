import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MapPin, ChevronRight, Building } from 'lucide-react';

interface LocationsPageProps {
  onNavigate: (path: string) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ onNavigate }) => {
  const { locations, setFilters } = useMarketplace();

  const handleSelectLocation = (cityName: string) => {
    setFilters(prev => ({ ...prev, location: cityName }));
    onNavigate('/vehicles');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Regional Hubs</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vehicles by City & State</h1>
        <p className="text-sm text-slate-500">Discover verified pre-owned dump trucks, tractor trailers and commercial vehicles available in your city.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => handleSelectLocation(loc.name)}
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-lg transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {loc.name}
                </h3>
                <span className="text-xs text-slate-400">{loc.state}</span>
                <span className="block text-[11px] text-blue-600 font-bold mt-0.5">
                  {loc.listingCount} Vehicles
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
          </div>
        ))}
      </div>
    </div>
  );
};
