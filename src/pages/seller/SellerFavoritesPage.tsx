import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VehicleCard } from '../../components/ui/VehicleCard';
import { Vehicle } from '../../types';
import { Heart, Car } from 'lucide-react';

interface SellerFavoritesPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigate: (path: string) => void;
}

export const SellerFavoritesPage: React.FC<SellerFavoritesPageProps> = ({ onSelectVehicle, onNavigate }) => {
  const { favorites, publishedVehicles } = useMarketplace();

  const savedVehicles = publishedVehicles.filter(v => favorites.includes(v.id));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span>Saved Vehicles</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Favourites</h1>
        <p className="text-xs text-slate-500 mt-0.5">Vehicles you have bookmarked for quick access and tracking</p>
      </div>

      {savedVehicles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Saved Vehicles</h3>
          <p className="text-xs text-slate-500">Tap the heart icon on any vehicle card to save it here.</p>
          <button
            onClick={() => onNavigate('/vehicles')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Explore Vehicles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVehicles.map(v => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onSelect={onSelectVehicle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
