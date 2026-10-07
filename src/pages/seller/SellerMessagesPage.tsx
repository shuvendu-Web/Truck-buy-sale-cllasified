import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { MessageSquare, Send, User, Car, Clock, ShieldCheck } from 'lucide-react';

export const SellerMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { conversations, messages, sendMessage } = useMarketplace();

  const userConversations = conversations.filter(c => c.participantIds.includes(user?.id || 'seller-rohit'));
  const [selectedConvId, setSelectedConvId] = useState<string>(userConversations[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const activeConversation = conversations.find(c => c.id === selectedConvId) || userConversations[0];
  const activeMessages = messages.filter(m => m.conversationId === activeConversation?.id);

  const receiverId = activeConversation?.participantIds.find(id => id !== (user?.id || 'seller-rohit')) || 'buyer-rahul';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConversation) return;

    setSending(true);
    try {
      await sendMessage(activeConversation.id, replyText, receiverId, activeConversation.vehicleId);
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden h-[720px] flex flex-col md:flex-row">
      
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Messages</span>
          </h2>
          <span className="text-[11px] font-bold text-slate-400">
            {userConversations.length} chats
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {userConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations yet.
            </div>
          ) : (
            userConversations.map((conv) => {
              const otherId = conv.participantIds.find(id => id !== user?.id) || '';
              const otherName = conv.participantNames[otherId] || 'User';
              const isSelected = conv.id === activeConversation?.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                    isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <img
                    src={conv.participantAvatars?.[otherId] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherName}`}
                    alt={otherName}
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{otherName}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 truncate block">
                      {conv.vehicleTitle}
                    </span>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Chat Stream */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-50/50">
          
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.vehicleImage}
                alt={activeConversation.vehicleTitle}
                className="w-10 h-9 object-cover rounded-xl border border-slate-100 shrink-0"
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900 truncate max-w-sm">
                  {activeConversation.vehicleTitle}
                </h3>
                <span className="text-[10px] font-extrabold text-blue-600">
                  ₹{activeConversation.vehiclePrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 block">
                {activeConversation.participantNames[receiverId] || 'Buyer'}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeMessages.map((msg) => {
              const isMe = msg.senderId === user?.id || (user?.role === 'seller' && msg.senderId === 'seller-rohit');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Select a conversation from the left
        </div>
      )}
    </div>
  );
};
