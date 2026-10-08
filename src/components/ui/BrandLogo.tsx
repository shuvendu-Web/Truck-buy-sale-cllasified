import React, { useState } from 'react';

interface BrandLogoProps {
  src: string;
  name: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ src, name, className = '' }) => {
  const [error, setError] = useState(false);

  const getAvatarColor = (str: string) => {
    const colors = [
      'bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 
      'bg-purple-500', 'bg-indigo-500', 'bg-teal-500', 'bg-cyan-500'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (error || !src) {
    const bgColor = getAvatarColor(name);
    // Determine size based on className. For standard brand cards, usually h-10 w-10 or h-12 w-12 is good if not explicitly passed.
    // The parent uses max-h-10 or max-h-12 and object-contain. We'll set a standard circle size.
    const hasSize = className.includes('w-') || className.includes('h-');
    const defaultSize = hasSize ? '' : 'w-10 h-10';
    
    return (
      <div 
        className={`flex items-center justify-center rounded-full text-white font-bold text-lg shadow-sm ${bgColor} ${defaultSize} ${className.replace(/object-contain|transition|duration-\d+/g, '')}`}
        title={name}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setError(true)}
    />
  );
};
