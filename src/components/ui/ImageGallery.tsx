import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(false);

  const galleryImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
        <img
          src={galleryImages[currentIndex]}
          alt={`${title} - view ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${zoom ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={() => setZoom(!zoom)}
        />

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setLightboxOpen(true)}
            className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition shadow-lg"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition opacity-0 group-hover:opacity-100 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
          {currentIndex + 1} / {galleryImages.length} Photos
        </div>
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setZoom(false);
              }}
              className={`relative shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center">
            <img
              src={galleryImages[currentIndex]}
              alt={title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-white/80 text-sm font-medium">
            {title} ({currentIndex + 1} of {galleryImages.length})
          </div>
        </div>
      )}
    </div>
  );
};
