import React, { useState } from 'react';
import { Vehicle, ReportReason } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, AlertTriangle, Flag } from 'lucide-react';

interface ReportModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS: ReportReason[] = [
  'Fake Listing',
  'Incorrect Price',
  'Wrong Information',
  'Duplicate',
  'Scam',
  'Inappropriate Content',
  'Vehicle Already Sold',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({ vehicle, isOpen, onClose }) => {
  const { user } = useAuth();
  const { submitReport } = useMarketplace();

  const [reason, setReason] = useState<ReportReason>('Wrong Information');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitReport({
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      reporterEmail: email || 'anonymous@satyadeal.com',
      reporterName: user?.name,
      reason,
      details,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base">Report Suspicious Listing</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Flag className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800">Report Submitted</h4>
            <p className="text-xs text-slate-500">Our safety moderators will review this listing shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-xs text-slate-600">
              Help us keep the marketplace safe. Reporting <span className="font-semibold text-slate-900">"{vehicle.title}"</span>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Flagging *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Details</label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what is inaccurate or suspicious about this listing..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email (for updates)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
