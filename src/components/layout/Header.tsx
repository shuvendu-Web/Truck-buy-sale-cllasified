import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Car, 
  PlusCircle, 
  Search, 
  Bell, 
  User, 
  ShieldCheck, 
  LogOut, 
  Heart, 
  MessageSquare, 
  LayoutDashboard, 
  ChevronDown, 
  Menu, 
  X,
  Sparkles,
  Inbox,
  Phone,
  Mail
} from 'lucide-react';
import { AuthModal } from '../ui/AuthModal';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { user, isAuthenticated, isSuperAdmin, isSeller, logout } = useAuth();
  const { favorites, pendingApprovalsCount } = useMarketplace();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotification();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSellClick = () => {
    if (!isAuthenticated) {
      setAuthModalMode('register');
      setAuthModalOpen(true);
    } else {
      onNavigate('/dashboard/listings/new');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Vehicles', path: '/vehicles' },
    { label: 'Categories', path: '/categories' },
    { label: 'Brands', path: '/brands' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Nav */}
      <div className="bg-slate-900 text-white text-xs relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          
          {/* Left Section: Contact Info (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+9103340228800" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">+91 (033) 4022-8800</span>
            </a>
            <a href="mailto:support@satyadeal.com" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
              <Mail className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">support@satyadeal.com</span>
            </a>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center justify-end gap-4 sm:gap-6 w-full md:w-auto">
          
          {/* Saved Vehicles */}
          <button
            onClick={() => onNavigate(isAuthenticated ? '/dashboard/favorites' : '/vehicles')}
            className="relative flex items-center gap-1.5 text-slate-300 hover:text-white transition"
          >
            <Heart className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide">Saved Vehicles</span>
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-wide">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in text-slate-800">
                <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={deleteAllNotifications}
                      className="text-[11px] font-semibold text-rose-600 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) {
                            onNavigate(notif.link);
                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                          !notif.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <div className="flex-1 pr-2">
                          <h5 className="text-xs font-bold text-slate-800">{notif.title}</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sell Vehicle */}
          <button
            onClick={handleSellClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Sell Vehicle</span>
          </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center">
                <span className="text-green-600">Satya</span><span className="text-blue-600">Deal</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                Verified Vehicles
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 font-bold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            
            {/* Search Quick Button */}
            <button
              onClick={() => onNavigate('/vehicles')}
              className="p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition"
              title="Search Marketplace"
            >
              <Search className="w-5 h-5" />
            </button>



            {/* Super Admin Switcher Pill (if Super Admin) */}
            {isSuperAdmin && (
              <button
                onClick={() => onNavigate('/admin')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition border border-purple-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Super Admin</span>
                {pendingApprovalsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-bounce">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            )}



            {/* User Profile / Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition border border-slate-200"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-xl object-cover bg-blue-100"
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[90px]">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider block">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in divide-y divide-slate-50">
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {isSuperAdmin && (
                        <button
                          onClick={() => {
                            onNavigate('/admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Super Admin Panel</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onNavigate('/dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Seller Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/dashboard/listings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Car className="w-4 h-4 text-slate-400" />
                        <span>My Listings</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/dashboard/interests');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Inbox className="w-4 h-4 text-slate-400" />
                        <span>Interested Buyers</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/dashboard/messages');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Messages</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
            <button
              onClick={() => {
                handleSellClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2 mb-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Your Vehicle</span>
            </button>

            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              >
                {link.label}
              </button>
            ))}

            {isSuperAdmin && (
              <button
                onClick={() => {
                  onNavigate('/admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-purple-700 bg-purple-50"
              >
                Super Admin Panel
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={() => {
                  onNavigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-blue-600 bg-blue-50"
              >
                My Seller Dashboard
              </button>
            )}
          </div>
        )}
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};
