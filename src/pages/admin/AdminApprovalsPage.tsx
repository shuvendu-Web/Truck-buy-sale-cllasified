import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { AdminRejectModal } from '../../components/ui/AdminRejectModal';
import { Vehicle } from '../../types';
import { 
  CheckSquare, 
  Check, 
  X, 
  Eye, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Calendar,
  Fuel,
  Gauge
} from 'lucide-react';

interface AdminApprovalsPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigate: (path: string) => void;
}

export const AdminApprovalsPage: React.FC<AdminApprovalsPageProps> = ({ 
  onSelectVehicle, 
  onNavigate 
}) => {
  const { vehicles, approveVehicle, rejectVehicle } = useMarketplace();
  const { user } = useAuth();

  const [rejectingVehicle, setRejectingVehicle] = useState<Vehicle | null>(null);

  const pendingVehicles = vehicles.filter(v => v.status === 'pending');

  const handleApprove = (vehicle: Vehicle) => {
    approveVehicle(vehicle.id, user?.name || 'Super Admin');
  };

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
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Listing Verification Gate</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Pending Vehicle Approvals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review newly submitted vehicle classifieds before public marketplace release
          </p>
        </div>

        <span className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>{pendingVehicles.length} Vehicles Awaiting Decision</span>
        </span>
      </div>

      {/* Approvals Review Queue */}
      {pendingVehicles.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            There are no vehicle listings awaiting review. All current submissions have been processed and published.
          </p>
          <button
            onClick={() => onNavigate('/admin/listings')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition"
          >
            View All Active Listings
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Side: Vehicle Details & Specs */}
              <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                <img
                  src={vehicle.featuredImage || vehicle.images[0]}
                  alt={vehicle.title}
                  className="w-full sm:w-36 h-28 object-cover rounded-2xl bg-slate-100 border border-slate-200 shrink-0"
                />

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                      {vehicle.category}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Pending Review
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Submitted: {new Date(vehicle.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{vehicle.title}</h3>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-lg font-extrabold text-blue-600">
                      ₹{vehicle.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-semibold">{vehicle.year} Mfg</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-semibold">{vehicle.fuelType}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-semibold">{vehicle.kmDriven.toLocaleString()} km</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vehicle.location.city}, {vehicle.location.state}</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span>Seller: </span>
                      <span className="font-bold text-slate-800">{vehicle.sellerInfo.name}</span>
                      <span className="text-slate-400 ml-1">({vehicle.sellerInfo.phone})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Approval Action Buttons */}
              <div className="flex items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                <button
                  onClick={() => onSelectVehicle(vehicle)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => setRejectingVehicle(vehicle)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition border border-rose-200"
                >
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleApprove(vehicle)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Publish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
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
