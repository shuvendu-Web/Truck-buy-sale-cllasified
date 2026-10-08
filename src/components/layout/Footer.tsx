import React from 'react';
import { Truck, ShieldCheck, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-green-600">Satya</span><span className="text-blue-500">Deal</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              SatyaDeal is India's most trusted classified vehicle marketplace. Buy and sell verified dump trucks, tractor trailers, trucks, and Flatbed Trucks directly with verified owners.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Listings</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span>0% Commission</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('/vehicles')} className="hover:text-blue-400 transition">
                  Browse All Vehicles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/categories')} className="hover:text-blue-400 transition">
                  Vehicle Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/brands')} className="hover:text-blue-400 transition">
                  Popular Brands
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/locations')} className="hover:text-blue-400 transition">
                  Cities & Locations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard/listings/new')} className="hover:text-blue-400 transition">
                  Sell Your Vehicle
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-blue-400 transition">
                  About SatyaDeal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-blue-400 transition">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-blue-400 transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-blue-400 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-purple-400 hover:text-purple-300 transition font-semibold">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Headquarters</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Salt Lake Sector V, Kolkata, West Bengal, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 (033) 4022-8800</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>support@satyadeal.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SatyaDeal Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/terms')} className="hover:text-slate-400">Terms</button>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-slate-400">Privacy</button>
            <button onClick={() => onNavigate('/contact')} className="hover:text-slate-400">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
