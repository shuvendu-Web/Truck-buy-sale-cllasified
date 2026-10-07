import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { X, AlertCircle } from 'lucide-react';

interface AdminRejectModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
}

const DEFAULT_REJECTION_REASONS = [
  'Poor quality images or blurred watermarks',
  'Incorrect vehicle details or mismatched model specifications',
  'Duplicate listing already active on platform',
  'Unrealistically low or deceptive pricing',
  'Invalid registration number or expired documents',
  'Suspicious listing activity detected',
  'Inappropriate language or commercial spam',
];

export const AdminRejectModal: React.FC<AdminRejectModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onConfirmReject,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_REJECTION_REASONS[0]);
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const handleReject = () => {
    const fullReason = customNote.trim() 
      ? `${selectedPreset}: ${customNote.trim()}`
      : selectedPreset;
    onConfirmReject(fullReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-bold text-base">Reject Listing Approval</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-400 block mb-0.5">Vehicle:</span>
            <span className="font-bold text-slate-800">{vehicle.title}</span> (Seller: {vehicle.sellerInfo.name})
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Standard Rejection Reason *</label>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {DEFAULT_REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Admin Instructions to Seller (Optional)</label>
            <textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Please upload clear front and rear view photos taken in daylight and update valid insurance date."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Note: The seller will receive a notification and can edit their listing to address these points and resubmit.
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
