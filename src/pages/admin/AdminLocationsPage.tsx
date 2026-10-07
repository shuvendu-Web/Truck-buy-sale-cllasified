import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { LocationItem, InterestStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MapPin, Plus, Trash2, X, Inbox, Search, Phone, Mail } from 'lucide-react';

export const AdminLocationsPage: React.FC = () => {
  const { locations, saveLocationItem, deleteLocationItem } = useMarketplace();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveLocationItem({
      id: 'loc-' + Date.now(),
      name,
      state,
      country: 'India',
      listingCount: 0,
      active: true,
    });
    setModalOpen(false);
    setName('');
    setState('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Geographic Coverage</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Locations & Cities</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage search locations and urban marketplaces</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{loc.name}</h4>
                <span className="text-[10px] text-slate-400">{loc.state}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm(`Delete location "${loc.name}"?`)) {
                  deleteLocationItem(loc.id);
                }
              }}
              className="p-1 text-slate-300 hover:text-rose-600 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900">Add City Location</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jaipur / Chandigarh"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Rajasthan"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">Save Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminInterestsPage: React.FC = () => {
  const { 
    interests, 
    updateInterestStatus, 
    emiLeads, 
    updateEmiLeadStatus, 
    deleteEmiLead 
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'interests' | 'emi'>('interests');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterests = interests.filter((i) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        i.buyerName.toLowerCase().includes(q) ||
        i.buyerPhone.includes(q) ||
        i.vehicleTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredEmiLeads = emiLeads.filter((l) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        l.buyerName.toLowerCase().includes(q) ||
        l.buyerPhone.includes(q) ||
        l.bankName.toLowerCase().includes(q) ||
        l.vehicleTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Platform Leads</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Buyer Inquiries & EMI Applications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {interests.length} Direct Inquiries • {emiLeads.length} Bank Loan Applications generated from storefront
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('interests')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'interests'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Direct Buyer Interests ({interests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('emi')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'emi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🏦</span>
          <span>EMI Loan Leads ({emiLeads.length})</span>
        </button>
      </div>

      {activeTab === 'interests' ? (
        /* DIRECT INQUIRIES TABLE */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Buyer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Message</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInterests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No buyer inquiries found.</td>
                  </tr>
                ) : (
                  filteredInterests.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block truncate max-w-[180px]">{item.vehicleTitle}</span>
                        <span className="text-[10px] text-blue-600 font-bold">₹{item.vehiclePrice.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{item.buyerName}</span>
                        <span className="text-[10px] text-slate-400">{item.buyerLocation || 'Kolkata'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <a href={`tel:${item.buyerPhone}`} className="text-emerald-700 font-bold hover:underline block flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600 inline" />
                          <span>{item.buyerPhone}</span>
                        </a>
                        <span className="text-[10px] text-slate-400 block">{item.buyerEmail || item.preferredContact}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate italic">"{item.message}"</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => updateInterestStatus(item.id, e.target.value as InterestStatus)}
                          className="px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Negotiating">Negotiating</option>
                          <option value="Closed">Closed</option>
                          <option value="Not Interested">Not Interested</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[10px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* EMI & AUTO LOAN APPLICATIONS TABLE */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-emerald-50/70 border-b border-emerald-100 text-emerald-900 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Financing Bank</th>
                  <th className="py-3.5 px-4">Monthly EMI</th>
                  <th className="py-3.5 px-4">Loan Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmiLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">No EMI applications found.</td>
                  </tr>
                ) : (
                  filteredEmiLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-emerald-50/20 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block truncate max-w-[180px]">{lead.vehicleTitle}</span>
                        <span className="text-[10px] text-slate-500">Price: ₹{lead.vehiclePrice.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{lead.buyerName}</span>
                        <a href={`tel:${lead.buyerPhone}`} className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 inline" />
                          <span>{lead.buyerPhone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">{lead.bankName}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">{lead.interestRate}% p.a.</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-black text-emerald-700 block">
                          ₹{lead.monthlyEmi.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400">/ mo ({lead.tenureMonths} Mo)</span>
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-600">
                        <div>Loan: <strong className="text-blue-700">₹{lead.loanAmount.toLocaleString('en-IN')}</strong></div>
                        <div className="text-slate-400 text-[10px]">Down Pay: ₹{lead.downPayment.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateEmiLeadStatus(lead.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg text-xs font-bold border border-emerald-300 bg-emerald-50/50 text-emerald-900 focus:outline-none cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Bank Followup">Bank Followup</option>
                          <option value="Approved">Sanctioned / Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            if (confirm(`Delete EMI lead for ${lead.buyerName}?`)) {
                              deleteEmiLead(lead.id);
                            }
                          }}
                          className="p-1 text-slate-300 hover:text-rose-600 transition cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
