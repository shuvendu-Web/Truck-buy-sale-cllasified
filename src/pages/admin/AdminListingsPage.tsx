import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AdminRejectModal } from '../../components/ui/AdminRejectModal';
import { Vehicle } from '../../types';
import { 
  Truck, 
  Search, 
  Filter, 
  Sparkles, 
  Check, 
  X, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  Star, 
  ShieldCheck, 
  RotateCcw,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';

interface AdminListingsPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicleId: string) => void;
  onNavigate: (path: string) => void;
}

export const AdminListingsPage: React.FC<AdminListingsPageProps> = ({
  onSelectVehicle,
  onEditVehicle,
  onNavigate,
}) => {
  const { 
    vehicles, 
    categories, 
    brands, 
    locations, 
    approveVehicle, 
    rejectVehicle, 
    toggleFeatured, 
    deleteVehicle 
  } = useMarketplace();
  const { user, isSuperAdmin } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [rejectingVehicle, setRejectingVehicle] = useState<Vehicle | null>(null);

  const filtered = vehicles.filter((v) => {
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && v.category !== categoryFilter) return false;
    if (brandFilter !== 'All' && v.brandName !== brandFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.sellerInfo.name.toLowerCase().includes(q) ||
        v.sellerInfo.phone.includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.location.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmReject = (reason: string) => {
    if (rejectingVehicle) {
      rejectVehicle(rejectingVehicle.id, reason, user?.name || 'Super Admin');
      setRejectingVehicle(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Platform Inventory</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage All Vehicle Listings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total of <span className="font-bold text-slate-800">{vehicles.length}</span> classified listings in database
          </p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard/listings/new')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search make, seller, phone, ID..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="approved">Approved / Published</option>
              <option value="pending">Pending Review</option>
              <option value="rejected">Rejected</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Seller</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Views / Leads</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((veh) => (
                <tr key={veh.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={veh.featuredImage || veh.images[0]}
                        alt={veh.title}
                        className="w-12 h-10 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate max-w-[180px]">{veh.title}</span>
                          {veh.featured && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{veh.category} • {veh.year}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{veh.sellerInfo.name}</span>
                    <span className="text-[10px] text-slate-400 block">{veh.sellerInfo.phone}</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-blue-600">
                    ₹{veh.price.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    {veh.location.city}, {veh.location.state}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={veh.status} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    <span className="font-bold text-slate-800">{veh.views}</span> views • <span className="text-blue-600 font-bold">{veh.interestCount}</span> leads
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectVehicle(veh)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isSuperAdmin && (
                        <button
                          onClick={() => toggleFeatured(veh.id)}
                          className={`p-1.5 rounded-lg transition ${
                            veh.featured ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-slate-100 text-slate-400'
                          }`}
                          title={veh.featured ? 'Remove Verified Status' : 'Mark as Verified'}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      )}

                      {veh.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveVehicle(veh.id, user?.name || 'Super Admin')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRejectingVehicle(veh)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onEditVehicle(veh.id)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete listing "${veh.title}" permanently?`)) {
                            deleteVehicle(veh.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingVehicle && (
        <AdminRejectModal
          vehicle={rejectingVehicle}
          isOpen={!!rejectingVehicle}
          onClose={() => setRejectingVehicle(null)}
          onConfirmReject={handleConfirmReject}
        />
      )}
    </div>
  );
};
