import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Search, 
  Bell, 
  Plus, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Inbox, 
  Car,
  Trash2
} from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onNavigate: (path: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, onNavigate }) => {
  const { user } = useAuth();
  const { pendingApprovalsCount } = useMarketplace();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotification();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleNotificationClick = (notif: { id: string; link?: string }) => {
    markAsRead(notif.id);
    setNotifDropdownOpen(false);
    if (notif.link) {
      onNavigate(notif.link);
    }
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-40 shadow-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Review Approvals Button */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => onNavigate('/admin/approvals')}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-2 animate-pulse-subtle"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>{pendingApprovalsCount} Approvals Pending</span>
          </button>
        )}

        {/* Live Marketplace shortcut */}
        <button
          onClick={() => onNavigate('/')}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Post Listing CTA */}
        <button
          onClick={() => onNavigate('/dashboard/listings/new')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Listing</span>
        </button>

        {/* ADMIN NOTIFICATION BELL WITH DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition shadow-xs"
            title="Admin Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popover */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-fade-in divide-y divide-slate-100">
              <div className="px-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Admin Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                    <Bell className="w-6 h-6 mx-auto text-slate-300 opacity-60" />
                    <p>No notifications right now</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`group relative p-3.5 hover:bg-blue-50/50 transition cursor-pointer flex items-start gap-3 ${
                        !notif.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        {notif.type === 'approval' ? (
                          <Car className="w-4 h-4 text-amber-600" />
                        ) : notif.type === 'interest' ? (
                          <Inbox className="w-4 h-4 text-blue-600" />
                        ) : notif.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        ) : (
                          <Info className="w-4 h-4 text-slate-600" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-6 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h5>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                          <span>
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                          {notif.link && (
                            <span className="text-blue-600 font-bold group-hover:underline">
                              Open &rarr;
                            </span>
                          )}
                        </div>
                      </div>

                      {/* RIGHT CORNER CROSS (X) BUTTON TO DELETE THIS NOTIFICATION */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNotification(e, notif.id)}
                        className="absolute top-3 right-3 p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete this notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
