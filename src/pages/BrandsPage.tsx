import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Tag, ChevronRight } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';

interface BrandsPageProps {
  onNavigate: (path: string) => void;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ onNavigate }) => {
  const { brands, setFilters } = useMarketplace();

  const handleSelectBrand = (brandName: string) => {
    setFilters(prev => ({ ...prev, brand: brandName }));
    onNavigate('/vehicles');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Top Automakers</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Browse by Manufacturer Brand</h1>
        <p className="text-sm text-slate-500">Discover verified listings from leading national and international vehicle brands.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => handleSelectBrand(brand.name)}
            className="group bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-20 flex items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/50 transition">
                <BrandLogo
                  src={brand.logo}
                  name={brand.name}
                  className="h-12 w-12 max-w-[130px] object-contain group-hover:scale-110 transition duration-300"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {brand.name}
                </h3>
                <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">
                  {brand.listingCount.toLocaleString()} Active Vehicles
                </span>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Explore {brand.name}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
