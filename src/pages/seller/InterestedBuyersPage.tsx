import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { InterestStatus, Interest } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  Inbox, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Search,
  Filter
} from 'lucide-react';

const STATUS_OPTIONS: InterestStatus[] = [
  'New',
  'Contacted',
  'Interested',
  'Negotiating',
  'Closed',
  'Not Interested',
];

export const InterestedBuyersPage: React.FC = () => {
  const { user } = useAuth();
  const { interests, updateInterestStatus } = useMarketplace();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const userInterests = interests.filter(
    i => i.sellerId === user?.id || (user?.role === 'seller' && i.sellerId === 'seller-rohit')
  );

  const filtered = userInterests.filter(item => {
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.buyerName.toLowerCase().includes(q) ||
        item.buyerPhone.includes(q) ||
        item.vehicleTitle.toLowerCase().includes(q) ||
        item.buyerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveNote = (id: string) => {
    updateInterestStatus(id, filtered.find(f => f.id === id)?.status || 'New', noteText);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Leads Pipeline</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Interested Buyer Inquiries</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage buyer inquiries, update deal stage, and follow up directly
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses ({userInterests.length})</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Buyer Leads Found</h3>
          <p className="text-xs text-slate-500">Inquiries submitted on your vehicles will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                {/* Buyer & Vehicle info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={item.vehicleImage}
                    alt={item.vehicleTitle}
                    className="w-20 h-16 object-cover rounded-2xl bg-slate-100 shrink-0 border border-slate-100"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{item.buyerName}</span>
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-blue-600 font-semibold">
                      Inquired on: <span className="text-slate-800 font-bold">{item.vehicleTitle}</span> (₹{item.vehiclePrice.toLocaleString('en-IN')})
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.buyerLocation}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-emerald-600">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{item.buyerPhone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{item.buyerEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Selector & Contact Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Status:</span>
                    <select
                      value={item.status}
                      onChange={(e) => updateInterestStatus(item.id, e.target.value as InterestStatus)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${item.buyerPhone}`}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition"
                      title="Call Buyer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://wa.me/${item.buyerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1 transition"
                      title="WhatsApp Buyer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Message snippet */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Buyer Message</span>
                <p className="italic leading-relaxed">"{item.message}"</p>
              </div>

              {/* Seller Notes */}
              <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                {editingNotesId === item.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add private note (e.g. promised test drive on Sunday)..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                    <button
                      onClick={() => handleSaveNote(item.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNotesId(null)}
                      className="px-2 py-1.5 text-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-slate-500 text-[11px]">
                      {item.notes ? `Note: ${item.notes}` : 'No private notes added.'}
                    </span>
                    <button
                      onClick={() => {
                        setEditingNotesId(item.id);
                        setNoteText(item.notes || '');
                      }}
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{item.notes ? 'Edit Note' : 'Add Note'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
