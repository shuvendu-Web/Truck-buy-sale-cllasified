import React, { useState } from 'react';
import { StorageService } from '../../lib/storage';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useNotification } from '../../context/NotificationContext';
import { UserProfile, UserStatus, UserRole } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Ban, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail,
  Car
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { vehicles } = useMarketplace();
  const { showToast } = useNotification();

  const [users, setUsers] = useState<UserProfile[]>(() => StorageService.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (statusFilter !== 'All' && u.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.city && u.city.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
    const updated = users.map(u => u.id === user.id ? { ...u, status: nextStatus } : u);
    setUsers(updated);
    StorageService.saveUsers(updated);
    showToast('info', 'Status Updated', `${user.name} is now ${nextStatus}.`);
  };

  const handleChangeRole = (user: UserProfile, newRole: UserRole) => {
    const updated = users.map(u => u.id === user.id ? { ...u, role: newRole } : u);
    setUsers(updated);
    StorageService.saveUsers(updated);
    showToast('success', 'Role Updated', `${user.name} is now a ${newRole}.`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user account?')) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      StorageService.saveUsers(updated);
      showToast('info', 'User Removed', 'Account deleted.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Authentication & RBAC</span>
          <h1 className="text-2xl font-extrabold text-slate-900">User Accounts & Roles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage permissions, active sellers, buyers and administrator access
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name or email..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="All">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Listings</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const userListingsCount = vehicles.filter(v => v.sellerId === u.id || (u.role === 'seller' && v.sellerId === 'seller-rohit')).length;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 ring-2 ring-blue-500/10"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{u.name}</span>
                            {u.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <span className="text-[10px] text-slate-400">Joined {u.joinedDate}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">{u.email}</span>
                      <span className="text-[10px] text-slate-400 block">{u.phone}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                          u.role === 'superadmin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'seller'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {u.city || 'Kolkata'}, {u.state || 'WB'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      {userListingsCount} vehicles
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={u.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            u.status === 'active'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
