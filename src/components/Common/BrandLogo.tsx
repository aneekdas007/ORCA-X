import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

// Build-safe eager glob for optional logo.png. Returns empty object if file is absent.
const logoModules = import.meta.glob<{ default: string }>('/src/assets/logo.png', { eager: true });
const detectedLogoUrl: string | null = logoModules['/src/assets/logo.png']?.default || null;

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (detectedLogoUrl && !imgError) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = detectedLogoUrl;
      }
    }
  }, [imgError]);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9'
  };

  if (detectedLogoUrl && !imgError) {
    return (
      <img
        src={detectedLogoUrl}
        alt="ORCA-X Logo"
        onError={() => setImgError(true)}
        className={`object-contain rounded-lg shrink-0 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-[#21618C] border border-[#3B82A0]/40 text-white shadow-sm shrink-0 ${sizeClasses[size]} ${className}`}
      title="ORCA-X Marine Intelligence"
    >
      <Compass className={`${iconSizes[size]} text-[#DCEAF2]`} />
    </div>
  );
};
