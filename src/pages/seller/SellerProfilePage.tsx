import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Save, 
  Camera, 
  Upload, 
  Trash2, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
];

export const SellerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useNotification();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Kolkata');
  const [state, setState] = useState(user?.state || 'West Bengal');
  const [avatar, setAvatar] = useState(user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Seller'}`);
  const [saving, setSaving] = useState(false);

  // Handle local DP file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('warning', 'File Too Large', 'Please select an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('info', 'Photo Selected', 'Click "Save Changes" to apply your new profile photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    setAvatar(newAvatar);
  };

  const handleRemovePhoto = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'User'}`;
    setAvatar(defaultAvatar);
    showToast('info', 'Photo Reset', 'Default avatar restored.');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        city,
        state,
        avatar,
      });
      showToast('success', 'Profile Updated', 'Your profile details and display picture have been saved successfully.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Account Management</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Profile & Seller Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your display picture, contact details and seller credentials</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* DISPLAY PICTURE / DP UPLOAD SECTION */}
          <div className="p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-2xl border border-blue-100 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Profile Display Picture (DP)
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* DP Avatar Preview with Camera Overlay */}
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-lg bg-blue-100"
                />
                
                {/* Overlay trigger button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 group-hover:bg-black/60 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
                  title="Upload new DP"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Change Photo</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
              </div>

              {/* Upload Actions */}
              <div className="space-y-2.5 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateRandomAvatar}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    title="Generate illustrated avatar"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                    <span>Generate Avatar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Reset Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Recommended: Square JPG, PNG, or WebP. Max size: 5MB. Visible on your vehicle listings & buyer chats.
                </p>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div className="pt-2 border-t border-blue-100/80">
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">Or choose from photo presets:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      avatar === preset ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BASIC INFORMATION FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">State / Region</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Seller Account</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
