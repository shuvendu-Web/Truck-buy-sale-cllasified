import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  LayoutDashboard, 
  Car, 
  PlusCircle, 
  Inbox, 
  MessageSquare, 
  Heart, 
  User, 
  Settings, 
  LogOut, 
  ArrowLeft,
  ShieldCheck 
} from 'lucide-react';

interface SellerSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SellerSidebar: React.FC<SellerSidebarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const { vehicles, interests, favorites } = useMarketplace();

  const userVehicles = vehicles.filter(v => v.sellerId === user?.id || (user?.role === 'seller' && v.sellerId === 'seller-rohit'));
  const userInterests = interests.filter(i => i.sellerId === user?.id || (user?.role === 'seller' && i.sellerId === 'seller-rohit'));
  const newInterestsCount = userInterests.filter(i => i.status === 'New').length;

  const links = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/dashboard/listings', icon: Car, badge: userVehicles.length },
    { label: 'Add New Vehicle', path: '/dashboard/listings/new', icon: PlusCircle, highlight: true },
    { label: 'Interested Buyers', path: '/dashboard/interests', icon: Inbox, badge: newInterestsCount, badgeColor: 'bg-emerald-500' },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { label: 'Saved Vehicles', path: '/dashboard/favorites', icon: Heart, badge: favorites.length },
    { label: 'Seller Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Seller Mini Profile */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
          alt={user?.name}
          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-500/20"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h4>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <span className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider block">
            {user?.role === 'superadmin' ? 'Super Admin' : 'Verified Seller'}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = currentPath === link.path;
          const Icon = link.icon;
          return (
            <button
              key={link.path}
              onClick={() => onNavigate(link.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                link.highlight && !isActive
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold'
                  : isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </div>

              {link.badge !== undefined && link.badge > 0 && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : link.badgeColor ? `${link.badgeColor} text-white` : 'bg-slate-200 text-slate-700'
                }`}>
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}

        {isSuperAdmin && (
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/admin')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition border border-purple-200"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Go to Admin Portal</span>
            </button>
          </div>
        )}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Marketplace Home</span>
        </button>

        <button
          onClick={() => {
            logout();
            onNavigate('/');
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
