import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Plus, Trash2, CheckCircle, XCircle, Star, UploadCloud } from 'lucide-react';
import { Testimonial } from '../../types';

export const AdminTestimonialsPage: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonialStatus, deleteTestimonial } = useMarketplace();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    image: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestimonial: Testimonial = {
      id: 'test-' + Date.now(),
      name: formData.name,
      role: formData.role,
      text: formData.text,
      rating: formData.rating,
      image: formData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
      status: 'pending', // Requires super admin approval
      createdAt: new Date().toISOString(),
    };
    addTestimonial(newTestimonial);
    setModalOpen(false);
    setFormData({ name: '', role: '', text: '', rating: 5, image: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Platform Social Proof</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Testimonial Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Approve, reject, or add new testimonials</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex gap-4 items-start">
              <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-100" />
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">{t.name}</h3>
                <span className="text-xs text-blue-600 font-semibold">{t.role}</span>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
              <div className="ml-auto">
                <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${
                  t.status === 'approved' ? 'bg-green-100 text-green-700' :
                  t.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">
              "{t.text}"
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              {t.status !== 'approved' && (
                <button
                  onClick={() => updateTestimonialStatus(t.id, 'approved')}
                  className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
              )}
              {t.status !== 'rejected' && (
                <button
                  onClick={() => updateTestimonialStatus(t.id, 'rejected')}
                  className="flex-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Delete this testimonial permanently?')) {
                    deleteTestimonial(t.id);
                  }
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Add Testimonial</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role/Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quote / Text *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.text}
                  onChange={e => setFormData({...formData, text: e.target.value})}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Profile Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="profileImageUploadAdmin"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="profileImageUploadAdmin"
                      className="flex items-center justify-center gap-2 w-full p-2.5 bg-slate-50 border border-slate-200 border-dashed hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-sm font-semibold cursor-pointer transition"
                    >
                      <UploadCloud className="w-4 h-4" />
                      {formData.image ? 'Image Selected' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition">
                  Submit Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
