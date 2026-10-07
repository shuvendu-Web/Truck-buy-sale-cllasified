import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, LogIn, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  defaultRole = 'seller'
}) => {
  const { loginWithEmail, loginWithGoogle, loginAsDemo, register } = useAuth();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, role);
        showToast('success', 'Welcome Back!', `Logged in successfully.`);
        onClose();
      } else if (mode === 'register') {
        await register(name, email, phone, role);
        showToast('success', 'Account Created!', `Welcome to SatyaDeal!`);
        onClose();
      } else if (mode === 'forgot') {
        showToast('info', 'Password Reset Email Sent', `If an account exists for ${email}, a reset link has been sent.`);
        setMode('login');
      }
    } catch (err) {
      showToast('error', 'Authentication Failed', 'Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoType: 'superadmin' | 'seller' | 'buyer') => {
    setLoading(true);
    try {
      const user = await loginAsDemo(demoType);
      showToast(
        'success', 
        `Logged in as ${user.name}`, 
        `Active Role: ${user.role.toUpperCase()}`
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-blue-200" />
              <span className="text-green-600">Satya</span><span className="text-blue-600">Deal</span> Portal
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">
              {mode === 'login' ? 'Sign In to SatyaDeal' : mode === 'register' ? 'Create New Account' : 'Reset Password'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switchers */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Instant 1-Click Demo Login
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('superadmin')}
              className="py-1.5 px-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition flex flex-col items-center border border-purple-200"
            >
              <span>Super Admin</span>
              <span className="text-[9px] font-normal text-purple-600">Full Control</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('seller')}
              className="py-1.5 px-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold transition flex flex-col items-center border border-blue-200"
            >
              <span>Seller Rohit</span>
              <span className="text-[9px] font-normal text-blue-600">Post & Manage</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('buyer')}
              className="py-1.5 px-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition flex flex-col items-center border border-emerald-200"
            >
              <span>Buyer Rahul</span>
              <span className="text-[9px] font-normal text-emerald-600">Submit Inquiries</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Intent</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    role === 'seller'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/10'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${role === 'seller' ? 'text-blue-600' : 'text-slate-300'}`} />
                  Sell Vehicles
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    role === 'buyer'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/10'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${role === 'buyer' ? 'text-blue-600' : 'text-slate-300'}`} />
                  Browse & Buy
                </button>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
            </button>
          </div>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-2 text-[11px] text-slate-400 font-medium uppercase">Or</span>
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"/>
            </svg>
            Continue with Google
          </button>

          {/* Toggle between login / register */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign Up Free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
