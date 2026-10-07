import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { History, ShieldCheck, CheckCircle2, XCircle, Sparkles, Tag, FolderTree } from 'lucide-react';

export const AdminActivityLogsPage: React.FC = () => {
  const { adminLogs } = useMarketplace();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Audit Trail</span>
        <h1 className="text-2xl font-extrabold text-slate-900">System Activity & Moderation Logs</h1>
        <p className="text-xs text-slate-500 mt-0.5">Immutable record of all administrative approvals, rejections, and configurations</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="divide-y divide-slate-100">
          {adminLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex items-start gap-3.5 text-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <History className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{log.adminName}</span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {log.action}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">{log.details}</p>
                <span className="text-[10px] text-slate-400 font-mono">Target: {log.targetType} ({log.targetId})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, saveEmiBank, deleteEmiBank } = useMarketplace();
  const [adminContactNumber, setAdminContactNumber] = useState(settings?.adminContactNumber || '+91 98301 23456');
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || 'support@satyadeal.com');
  const [requireAdminApproval, setRequireAdminApproval] = useState(settings?.requireAdminApproval ?? true);
  const [saving, setSaving] = useState(false);

  // New Bank Modal State
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [editBankId, setEditBankId] = useState<string | null>(null);
  const [newBankName, setNewBankName] = useState('');
  const [newBankRate, setNewBankRate] = useState(8.5);
  const [newBankFee, setNewBankFee] = useState('₹1,500 + GST');
  const [newBankPopular, setNewBankPopular] = useState(false);

  const handleEditBank = (bank: any) => {
    setEditBankId(bank.id);
    setNewBankName(bank.bankName);
    setNewBankRate(bank.annualInterestRate);
    setNewBankFee(bank.processingFee);
    setNewBankPopular(bank.isPopular || false);
    setBankModalOpen(true);
  };

  const handleAddBankClick = () => {
    setEditBankId(null);
    setNewBankName('');
    setNewBankRate(8.5);
    setNewBankFee('₹1,500 + GST');
    setNewBankPopular(false);
    setBankModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateSettings({
      adminContactNumber,
      supportEmail,
      requireAdminApproval,
    });
    setSaving(false);
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName.trim()) return;

    saveEmiBank({
      id: editBankId || 'bank-' + Date.now(),
      bankName: newBankName,
      annualInterestRate: Number(newBankRate),
      minDownPaymentPercent: 15,
      tenureMonths: [12, 24, 36, 48, 60, 84],
      processingFee: newBankFee,
      isPopular: newBankPopular,
    });

    setBankModalOpen(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Platform Helpline & Core Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Platform Control</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Marketplace & Helpline Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure platform contact numbers, approval policies, and financing partner banks</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 pt-4 border-t border-slate-100 text-xs">
          
          {/* Admin Helpline Contact Number */}
          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Platform / Admin Helpline Contact Number *</h4>
                <p className="text-slate-600 text-xs">
                  This phone number is displayed whenever customers click <strong>"Reveal Phone Number"</strong> on any vehicle listing across the marketplace.
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <input
                type="tel"
                required
                value={adminContactNumber}
                onChange={(e) => setAdminContactNumber(e.target.value)}
                placeholder="e.g. +91 98301 23456"
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-blue-300 bg-white text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Support Email */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Official Support Email</h4>
            <p className="text-slate-500 text-xs">Primary email displayed on support pages and legal notifications.</p>
            <div className="pt-1">
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Mandatory Super Admin Review</h4>
              <p className="text-slate-500 text-xs">Require administrator validation before any listing appears on the public website.</p>
            </div>
            <input 
              type="checkbox" 
              checked={requireAdminApproval} 
              onChange={(e) => setRequireAdminApproval(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" 
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Save Platform Settings
            </button>
          </div>
        </form>
      </div>

      {/* EMI & Partner Banks Management (Control multiple banks & interest rates) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Finance & Banking</span>
            <h3 className="text-xl font-extrabold text-slate-900">Partner Financing Banks (EMI Rates)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Control the banks and annual interest rates displayed in storefront EMI calculator</p>
          </div>

          <button
            type="button"
            onClick={handleAddBankClick}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Add Partner Bank</span>
          </button>
        </div>

        {/* Banks Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-emerald-50/60 border-b border-slate-200 text-emerald-950 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Bank / Provider</th>
                <th className="py-3 px-4">Annual Interest Rate</th>
                <th className="py-3 px-4">Processing Fee</th>
                <th className="py-3 px-4">Tenures Offered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(settings?.emiBanks || []).map((bank) => (
                <tr key={bank.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span>{bank.bankName}</span>
                    {bank.isPopular && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                    {bank.annualInterestRate}% p.a.
                  </td>
                  <td className="py-3 px-4 text-slate-600">{bank.processingFee}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {(bank.tenureMonths || [12, 24, 36, 48, 60]).join(', ')} Months
                  </td>
                  <td className="py-3 px-4 flex justify-end items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditBank(bank)}
                      className="text-blue-500 hover:text-blue-700 font-bold transition cursor-pointer"
                      title="Edit Bank"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove ${bank.bankName} from EMI partners?`)) {
                          deleteEmiBank(bank.id);
                        }
                      }}
                      className="text-slate-300 hover:text-rose-600 font-bold transition cursor-pointer"
                      title="Delete Bank"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bank Modal */}
      {bankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">{editBankId ? 'Edit Financing Partner Bank' : 'Add Financing Partner Bank'}</h3>
              <button onClick={() => setBankModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddBank} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="e.g. Bank of Baroda Auto Loan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Interest Rate (% p.a.) *</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={newBankRate}
                  onChange={(e) => setNewBankRate(Number(e.target.value))}
                  placeholder="8.5"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Processing Fee</label>
                <input
                  type="text"
                  value={newBankFee}
                  onChange={(e) => setNewBankFee(e.target.value)}
                  placeholder="e.g. 0.5% or ₹1,500"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newBankPopular}
                  onChange={(e) => setNewBankPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span className="text-slate-700 font-semibold">Mark as Featured / Top Recommended Bank</span>
              </label>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  {editBankId ? 'Save Changes' : 'Add Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
