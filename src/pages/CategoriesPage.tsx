import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Car, ChevronRight, Layers } from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const { categories, setFilters } = useMarketplace();

  const handleSelect = (categoryName: string) => {
    setFilters(prev => ({ ...prev, category: categoryName }));
    onNavigate('/vehicles');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Vehicle Types</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore by Vehicle Category</h1>
        <p className="text-sm text-slate-500">Find the perfect automobile matching your lifestyle and commercial requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelect(cat.name)}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="h-48 relative overflow-hidden bg-slate-100">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-600/80 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  {cat.listingCount.toLocaleString()} Listings
                </span>
                <h3 className="text-xl font-bold mt-1 text-white">{cat.name}s</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
              
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub, idx) => (
                  <span key={idx} className="text-[11px] font-semibold bg-slate-50 border border-slate-200/60 text-slate-600 px-2 py-0.5 rounded-lg">
                    {sub}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition">
                <span>View {cat.name} Listings</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
