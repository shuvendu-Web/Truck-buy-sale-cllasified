import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Vehicle } from '../../types';
import { 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ShoppingBag, 
  Copy, 
  AlertTriangle, 
  RotateCcw
} from 'lucide-react';

interface MyListingsPageProps {
  onNavigate: (path: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicleId: string) => void;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({ 
  onNavigate, 
  onSelectVehicle, 
  onEditVehicle 
}) => {
  const { user } = useAuth();
  const { vehicles, deleteVehicle, markAsSold, resubmitForApproval } = useMarketplace();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'sold'>('all');

  const userVehicles = vehicles.filter(v => v.sellerId === user?.id || (user?.role === 'seller' && v.sellerId === 'seller-rohit'));

  const filteredVehicles = userVehicles.filter(v => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return v.status === 'pending';
    if (activeTab === 'approved') return v.status === 'approved' || v.status === 'published';
    if (activeTab === 'rejected') return v.status === 'rejected';
    if (activeTab === 'sold') return v.status === 'sold';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Vehicle Management</span>
          <h1 className="text-2xl font-extrabold text-slate-900">My Vehicle Listings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track review progress and manage active classified listings</p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard/listings/new')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${userVehicles.length})` },
          { id: 'pending', label: `Pending (${userVehicles.filter(v => v.status === 'pending').length})` },
          { id: 'approved', label: `Approved (${userVehicles.filter(v => v.status === 'approved' || v.status === 'published').length})` },
          { id: 'rejected', label: `Rejected (${userVehicles.filter(v => v.status === 'rejected').length})` },
          { id: 'sold', label: `Sold (${userVehicles.filter(v => v.status === 'sold').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings Table / Cards */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Vehicles in this View</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any vehicle listings matching the "{activeTab}" filter.
          </p>
          <button
            onClick={() => onNavigate('/dashboard/listings/new')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs"
          >
            Post a Vehicle Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Vehicle Main Info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={vehicle.featuredImage || vehicle.images[0]}
                    alt={vehicle.title}
                    className="w-24 h-20 sm:w-28 sm:h-22 object-cover rounded-2xl bg-slate-100 shrink-0 border border-slate-100"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                        {vehicle.category}
                      </span>
                      <StatusBadge status={vehicle.status} size="sm" />
                      {vehicle.featured && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{vehicle.title}</h3>
                    <p className="text-xs font-extrabold text-blue-600">
                      ₹{vehicle.price.toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{vehicle.year}</span>
                      <span>•</span>
                      <span>{vehicle.location.city}</span>
                      <span>•</span>
                      <span>{vehicle.views} views</span>
                      <span>•</span>
                      <span className="text-blue-600 font-semibold">{vehicle.interestCount} buyer inquiries</span>
                    </div>
                  </div>
                </div>

                {/* Actions Button Row */}
                <div className="flex items-center gap-2 flex-wrap sm:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="View Listing Page"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onEditVehicle(vehicle.id)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Edit Listing"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  {vehicle.status !== 'sold' && (
                    <button
                      onClick={() => markAsSold(vehicle.id)}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Mark as Sold"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Mark Sold</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${vehicle.title}"?`)) {
                        deleteVehicle(vehicle.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rejection Details Banner if rejected */}
              {vehicle.status === 'rejected' && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Super Admin Rejection Notice:</span>
                      <p className="text-rose-700 mt-0.5">{vehicle.rejectionReason || 'Please review listing photos and specifications.'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => resubmitForApproval(vehicle.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resubmit for Review</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
