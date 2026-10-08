import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../lib/storage';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Vehicle } from '../../types';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Users, 
  Inbox, 
  TrendingUp, 
  ArrowUpRight, 
  CheckSquare, 
  Plus, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Eye
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, onSelectVehicle }) => {
  const { vehicles, interests, messages, approveVehicle } = useMarketplace();
  const { user } = useAuth();

  const allUsers = StorageService.getUsers();

  const totalListings = vehicles.length;
  const approvedListings = vehicles.filter(v => v.status === 'approved' || v.status === 'published').length;
  const pendingApprovals = vehicles.filter(v => v.status === 'pending');
  const rejectedListings = vehicles.filter(v => v.status === 'rejected').length;

  const totalUsersCount = allUsers.length;
  const activeSellersCount = allUsers.filter(u => u.role === 'seller').length;

  // Breakdown by body type
  const carsCount = vehicles.filter(v => v.category === 'Dump Truck').length;
  const bikesCount = vehicles.filter(v => v.category === 'Tractor Trailer').length;
  const suvsCount = vehicles.filter(v => v.category === 'Flatbed Truck').length;
  const trucksCount = vehicles.filter(v => v.category === 'Truck').length;
  const vansCount = vehicles.filter(v => v.category === 'Van').length;
  const othersCount = vehicles.filter(v => v.category === 'Other').length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Platform Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Real-time management of vehicle listings, approval workflows, user authentication, and buyer inquiry logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
          {pendingApprovals.length > 0 && (
            <button
              onClick={() => onNavigate('/admin/approvals')}
              className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Review {pendingApprovals.length} Pending</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('/dashboard/listings/new')}
            className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post Listing</span>
          </button>
        </div>
      </div>

      {/* Top 8 KPI Metric Cards with Trend Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Listings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Listings</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">{totalListings}</span>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12% this month
          </span>
        </div>

        {/* Approved */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600 block">{approvedListings}</span>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +14% vs last week
          </span>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-600 block">{pendingApprovals.length}</span>
          <span className="text-[11px] font-bold text-amber-600">Requires Action</span>
        </div>

        {/* Rejected */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-600 block">{rejectedListings}</span>
          <span className="text-[11px] font-bold text-rose-500">Quality Guard</span>
        </div>

        {/* Total Users */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">{totalUsersCount}</span>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18 registered
          </span>
        </div>

        {/* Active Sellers */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sellers</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">{activeSellersCount}</span>
          <span className="text-[11px] font-bold text-indigo-600">Verified</span>
        </div>

        {/* Buyer Interests */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buyer Leads</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">{interests.length}</span>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +25% conversion
          </span>
        </div>

        {/* In-App Messages */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Messages</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 block">{messages.length}</span>
          <span className="text-[11px] font-bold text-teal-600">Real-time sync</span>
        </div>
      </div>

      {/* 2-Column Analytics & Vehicle Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Listing Performance & Approvals Queue */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Approvals Quick Action Card */}
          {pendingApprovals.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900">
                  <Clock className="w-5 h-5 text-amber-600 animate-spin-slow" />
                  <h3 className="font-bold text-base">Pending Super Admin Approvals ({pendingApprovals.length})</h3>
                </div>
                <button
                  onClick={() => onNavigate('/admin/approvals')}
                  className="text-xs font-bold text-amber-800 hover:underline"
                >
                  View Full Approval Queue
                </button>
              </div>

              <div className="divide-y divide-amber-200/60">
                {pendingApprovals.slice(0, 3).map((veh) => (
                  <div key={veh.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={veh.featuredImage || veh.images[0]}
                        alt={veh.title}
                        className="w-14 h-11 object-cover rounded-xl bg-white border border-amber-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{veh.title}</h4>
                        <span className="text-[11px] text-slate-500">
                          Seller: {veh.sellerInfo.name} • Price: ₹{veh.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectVehicle(veh)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => approveVehicle(veh.id, user?.name || 'Super Admin')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Listings Management Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Marketplace Listings</h3>
                <p className="text-xs text-slate-500">Latest submissions across India</p>
              </div>
              <button
                onClick={() => onNavigate('/admin/listings')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>All Listings ({vehicles.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2">Image</th>
                    <th className="py-3 px-2">Vehicle</th>
                    <th className="py-3 px-2">Price</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {vehicles.slice(0, 6).map((veh) => (
                    <tr key={veh.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-2">
                        <img
                          src={veh.featuredImage || veh.images[0]}
                          alt={veh.title}
                          className="w-12 h-10 object-cover rounded-xl bg-slate-100 shrink-0"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-bold text-slate-900 block truncate max-w-[170px]">{veh.title}</span>
                        <span className="text-[10px] text-slate-400">{veh.sellerInfo.name} • {veh.location.city}</span>
                      </td>
                      <td className="py-3 px-2 font-bold text-blue-600">
                        ₹{veh.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={veh.status} size="sm" />
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
        </div>

        {/* Right Column: Vehicle Body Type Donut / Distribution + Quick Actions */}
        <div className="space-y-6">
          
          {/* Body Type Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Vehicle Type Distribution</h3>
            
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Dump Trucks ({carsCount})</span>
                  <span className="text-slate-900 font-bold">{Math.round((carsCount / totalListings) * 100 || 0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(carsCount / totalListings) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Tractor Trailers ({bikesCount})</span>
                  <span className="text-slate-900 font-bold">{Math.round((bikesCount / totalListings) * 100 || 0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(bikesCount / totalListings) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Flatbed Trucks ({suvsCount})</span>
                  <span className="text-slate-900 font-bold">{Math.round((suvsCount / totalListings) * 100 || 0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(suvsCount / totalListings) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Trucks & Vans ({trucksCount + vansCount})</span>
                  <span className="text-slate-900 font-bold">{Math.round(((trucksCount + vansCount) / totalListings) * 100 || 0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${((trucksCount + vansCount) / totalListings) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">Admin Quick Actions</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/admin/approvals')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center justify-between"
              >
                <span>Review Approvals Queue</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/admin/users')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center justify-between"
              >
                <span>Manage Users & Roles</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/admin/reports')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center justify-between"
              >
                <span>View Analytics Reports</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/admin/settings')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center justify-between"
              >
                <span>Platform Settings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
