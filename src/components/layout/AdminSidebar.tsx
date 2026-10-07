import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Car, 
  CheckSquare, 
  Users, 
  FolderTree, 
  Tag, 
  MapPin, 
  MessageSquare, 
  Inbox, 
  BarChart3, 
  History, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath, onNavigate }) => {
  const { pendingApprovalsCount, reports } = useMarketplace();
  const { logout, user } = useAuth();

  const pendingReportsCount = reports.filter(r => r.status === 'Pending').length;

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Pending Approvals', path: '/admin/approvals', icon: CheckSquare, badge: pendingApprovalsCount, badgeColor: 'bg-rose-500' },
    { label: 'All Listings', path: '/admin/listings', icon: Car },
    { label: 'User Accounts', path: '/admin/users', icon: Users },
    { label: 'Buyer Interests', path: '/admin/interests', icon: Inbox },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Brands & Makes', path: '/admin/brands', icon: Tag },
    { label: 'Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Sparkles },
    { label: 'Reports & Flags', path: '/admin/reports', icon: BarChart3, badge: pendingReportsCount, badgeColor: 'bg-amber-500' },
    { label: 'Activity Logs', path: '/admin/activity-logs', icon: History },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 select-none border-r border-slate-800 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
              <span className="text-green-500">Satya</span><span className="text-blue-400">Deal</span>
              <span className="text-[10px] uppercase font-extrabold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md border border-blue-500/30">
                Admin
              </span>
            </span>
            <span className="block text-[10px] text-slate-400 -mt-0.5">Super Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Admin User Mini Card */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
          alt={user?.name}
          className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-white truncate">{user?.name || 'Super Admin'}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          </div>
          <span className="text-[10px] text-slate-400 truncate block">shuvendu.dhenki@gmail.com</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-blue-500'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer actions */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          onClick={() => onNavigate('/')}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Marketplace</span>
        </button>

        <button
          onClick={() => {
            logout();
            onNavigate('/');
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
