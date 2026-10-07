import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  Car, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShoppingBag, 
  Inbox, 
  Plus, 
  TrendingUp, 
  Eye, 
  ArrowUpRight, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Vehicle } from '../../types';

interface SellerDashboardPageProps {
  onNavigate: (path: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ onNavigate, onSelectVehicle }) => {
  const { user } = useAuth();
  const { vehicles, interests, conversations } = useMarketplace();

  const userVehicles = vehicles.filter(v => v.sellerId === user?.id || (user?.role === 'seller' && v.sellerId === 'seller-rohit'));
  const userInterests = interests.filter(i => i.sellerId === user?.id || (user?.role === 'seller' && i.sellerId === 'seller-rohit'));

  const approvedCount = userVehicles.filter(v => v.status === 'approved' || v.status === 'published').length;
  const pendingCount = userVehicles.filter(v => v.status === 'pending').length;
  const rejectedCount = userVehicles.filter(v => v.status === 'rejected').length;
  const soldCount = userVehicles.filter(v => v.status === 'sold').length;
  const totalViews = userVehicles.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Seller Hub</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Manage your classified listings, track buyer interest leads, and monitor approval status in real-time.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard/listings/new')}
          className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Vehicle</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Car className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Listings</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{userVehicles.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Approved / Live</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{approvedCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Review</span>
          <span className="text-2xl font-black text-amber-600 mt-0.5 block">{pendingCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <XCircle className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rejected</span>
          <span className="text-2xl font-black text-rose-600 mt-0.5 block">{rejectedCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sold</span>
          <span className="text-2xl font-black text-purple-600 mt-0.5 block">{soldCount}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <Inbox className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Buyer Leads</span>
          <span className="text-2xl font-black text-sky-600 mt-0.5 block">{userInterests.length}</span>
        </div>
      </div>

      {/* 2-Column Analytics & Listings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Active Listings Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Vehicle Inventory</h2>
              <p className="text-xs text-slate-500">Recently posted vehicles and their approval states</p>
            </div>
            <button
              onClick={() => onNavigate('/dashboard/listings')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All ({userVehicles.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Vehicle</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Interests</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {userVehicles.slice(0, 4).map((veh) => (
                  <tr key={veh.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={veh.featuredImage || veh.images[0]}
                          alt={veh.title}
                          className="w-12 h-10 object-cover rounded-xl bg-slate-100 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block truncate max-w-[160px]">{veh.title}</span>
                          <span className="text-[10px] text-slate-400">{veh.year} • {veh.location.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-bold text-blue-600">
                      ₹{veh.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={veh.status} size="sm" />
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-700">
                      {veh.interestCount || 0} leads
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => onSelectVehicle(veh)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Recent Buyer Leads */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Buyer Leads</h2>
              <p className="text-xs text-slate-500">Inquiries submitted on your cars</p>
            </div>
            <button
              onClick={() => onNavigate('/dashboard/interests')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              All Leads
            </button>
          </div>

          <div className="space-y-3">
            {userInterests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No buyer inquiries yet.
              </div>
            ) : (
              userInterests.slice(0, 4).map((interest) => (
                <div key={interest.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{interest.buyerName}</span>
                    <StatusBadge status={interest.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                    "{interest.message}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>{interest.buyerPhone}</span>
                    <span>{new Date(interest.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
