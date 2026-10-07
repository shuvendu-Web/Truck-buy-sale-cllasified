import React from 'react';
import { VehicleStatus, InterestStatus, UserStatus } from '../../types';
import { Clock, CheckCircle2, XCircle, AlertCircle, ShoppingBag, EyeOff, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: VehicleStatus | InterestStatus | UserStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = <AlertCircle className="w-3.5 h-3.5" />;
  let label = status;

  if (normalized === 'approved' || normalized === 'published' || normalized === 'active' || normalized === 'interested') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    label = normalized === 'approved' ? 'Approved' : normalized === 'published' ? 'Published' : normalized === 'active' ? 'Active' : 'Interested';
  } else if (normalized === 'pending' || normalized === 'pending approval' || normalized === 'new') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10 animate-pulse-subtle';
    icon = <Clock className="w-3.5 h-3.5 text-amber-600" />;
    label = normalized === 'new' ? 'New Lead' : 'Pending Review';
  } else if (normalized === 'rejected' || normalized === 'suspended' || normalized === 'blocked' || normalized === 'not interested') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10';
    icon = <XCircle className="w-3.5 h-3.5 text-rose-600" />;
    label = normalized === 'rejected' ? 'Rejected' : normalized === 'suspended' ? 'Suspended' : normalized === 'blocked' ? 'Blocked' : 'Not Interested';
  } else if (normalized === 'sold') {
    bg = 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10';
    icon = <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />;
    label = 'Sold';
  } else if (normalized === 'contacted' || normalized === 'negotiating') {
    bg = 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/10';
    icon = <Clock className="w-3.5 h-3.5 text-sky-600" />;
    label = normalized === 'contacted' ? 'Contacted' : 'Negotiating';
  } else if (normalized === 'draft') {
    bg = 'bg-slate-100 text-slate-600 border-slate-300';
    icon = <EyeOff className="w-3.5 h-3.5" />;
    label = 'Draft';
  } else if (normalized === 'closed') {
    bg = 'bg-purple-50 text-purple-700 border-purple-200';
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />;
    label = 'Deal Closed';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border shadow-xs transition ${bg} ${sizeClasses}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};
