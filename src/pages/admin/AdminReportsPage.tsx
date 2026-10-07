import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  BarChart3, 
  Flag, 
  ShieldAlert, 
  TrendingUp, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Trash2,
  DollarSign,
  Building
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { vehicles, interests, reports, updateReportStatus } = useMarketplace();
  const [dateRange, setDateRange] = useState('30_days');

  const totalListings = vehicles.length;
  const publishedCount = vehicles.filter(v => v.status === 'approved' || v.status === 'published').length;
  const avgPrice = Math.round(vehicles.reduce((acc, curr) => acc + curr.price, 0) / (totalListings || 1));
  const totalLeads = interests.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Business Intelligence</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Analytics & Safety Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive marketplace health reports and flagged listings</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="7_days">Last 7 Days</option>
            <option value="30_days">Last 30 Days</option>
            <option value="3_months">Last 3 Months</option>
            <option value="1_year">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Vehicles</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalListings}</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">{publishedCount} published live</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Vehicle Price</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            ₹{avgPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Across all categories</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Top Brand</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">Maruti Suzuki</span>
          <span className="text-[10px] text-blue-600 font-bold mt-0.5 block">35% of total sales</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active City Hub</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">Kolkata, WB</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">High buyer inquiries</span>
        </div>
      </div>

      {/* Flagged / Reported Listings Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">User-Reported Listings & Flags</h2>
              <p className="text-xs text-slate-500">Security moderation complaints submitted by marketplace visitors</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {reports.length} Total Reports
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active suspicious listing reports. Platform is running cleanly!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((rep) => (
              <div key={rep.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rep.vehicleTitle}</span>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {rep.reason}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      Reported: {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 italic">"{rep.details}"</p>
                  <span className="text-[10px] text-slate-400">Reporter: {rep.reporterEmail}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateReportStatus(rep.id, 'Dismissed', 'Verified as valid listing')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => updateReportStatus(rep.id, 'Action Taken', 'Seller warned')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
