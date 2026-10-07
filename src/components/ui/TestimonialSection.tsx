import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Star, MessageSquarePlus, XCircle, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import { Testimonial } from '../../types';

export const TestimonialSection: React.FC = () => {
  const { testimonials, addTestimonial } = useMarketplace();
  const { showToast } = useNotification();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
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
    showToast('success', 'Review Submitted', 'Your review is pending admin approval.');
    setModalOpen(false);
    setFormData({ name: '', role: '', text: '', rating: 5, image: '' });
  };

  // Filter only approved testimonials
  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');

  if (approvedTestimonials.length === 0) return null;

  // Duplicate for seamless marquee effect
  const marqueeItems = [...approvedTestimonials, ...approvedTestimonials, ...approvedTestimonials];

  return (
    <section className="py-20 bg-slate-950 overflow-hidden relative">
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          Simple & <span className="bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">Transparent</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto px-4 mb-8">
          See what our verified buyers and sellers have to say about their experience with SatyaDeal.
        </p>
        
        <button 
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Share Your Experience
        </button>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
          {marqueeItems.map((testimonial, idx) => (
            <div 
              key={`${testimonial.id}-${idx}`} 
              onClick={() => setSelectedTestimonial(testimonial)}
              className="mx-4 w-80 shrink-0 bg-black text-white rounded-2xl border border-slate-800 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative -mt-px overflow-hidden rounded-t-2xl">
                <img 
                  src={testimonial.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'} 
                  alt={testimonial.name} 
                  className="h-[270px] w-full hover:scale-105 transition-all duration-300 object-cover object-top" 
                />
                <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t pointer-events-none from-black to-transparent"></div>
                
                {/* Rating Stars Overlay */}
                <div className="absolute bottom-3 left-4 z-20 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 whitespace-normal">
                <p className="font-medium text-slate-300 border-b border-gray-800 pb-5 text-sm italic leading-relaxed min-h-[80px]">
                  {testimonial.text}
                </p>
                <p className="mt-4 font-bold text-white">— {testimonial.name}</p>
                <p className="text-xs font-bold mt-1 bg-gradient-to-r from-[#8B5CF6] via-[#3b82f6] to-[#22c55e] text-transparent bg-clip-text">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Submit Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Submit a Review</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
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
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role/City *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g. Buyer from Delhi"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Review *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.text}
                  onChange={e => setFormData({...formData, text: e.target.value})}
                  placeholder="Share your experience buying or selling..."
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
                      id="profileImageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label 
                      htmlFor="profileImageUpload"
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
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Testimonial Detail Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black text-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-800 relative overflow-hidden"
          >
            <button 
              onClick={() => setSelectedTestimonial(null)} 
              className="absolute top-4 right-4 z-30 text-white/70 hover:text-white transition bg-black/20 hover:bg-black/40 rounded-full p-1"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <div className="relative h-64 sm:h-80 w-full">
              <img 
                src={selectedTestimonial.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'} 
                alt={selectedTestimonial.name} 
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-4 left-6 z-20 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < selectedTestimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <p className="font-medium text-slate-300 text-base sm:text-lg italic leading-relaxed mb-6">
                "{selectedTestimonial.text}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/30">
                  <img src={selectedTestimonial.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{selectedTestimonial.name}</h4>
                  <p className="text-sm font-bold bg-gradient-to-r from-[#8B5CF6] via-[#3b82f6] to-[#22c55e] text-transparent bg-clip-text">
                    {selectedTestimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* CSS for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
};
