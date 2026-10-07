import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { MessageSquare, Car, User, Clock, ShieldCheck } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const { conversations, messages } = useMarketplace();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Communications</span>
        <h1 className="text-2xl font-extrabold text-slate-900">Buyer-Seller Conversations</h1>
        <p className="text-xs text-slate-500 mt-0.5">Platform communication monitor to protect user privacy and prevent fraud</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conversations.map((conv) => (
          <div key={conv.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <img
                src={conv.vehicleImage}
                alt={conv.vehicleTitle}
                className="w-12 h-10 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-900 truncate">{conv.vehicleTitle}</h4>
                <span className="text-[10px] font-bold text-blue-600">₹{conv.vehiclePrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Participants:</span>
              <div className="flex items-center justify-between text-slate-700">
                {Object.values(conv.participantNames).map((name, idx) => (
                  <span key={idx} className="font-semibold">{name}</span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600">
              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Latest Message:</span>
              <p className="italic line-clamp-2">"{conv.lastMessage}"</p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Chat ID: {conv.id}</span>
              <span>{new Date(conv.lastMessageTime).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
