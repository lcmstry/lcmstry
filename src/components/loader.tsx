"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LogoIcon } from './icons/logo-icon';

export function Loader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoaded(true), 200);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div
      id="loader-wrapper"
      className={cn(
        "fixed inset-0 z-[9999] bg-background flex flex-col justify-center items-center transition-opacity duration-700",
        isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="relative flex justify-center items-center">
        <LogoIcon className="h-20 w-20 animate-pulse text-primary" />
      </div>
      <p className="mt-5 font-code text-primary">Memuat Konten...</p>
    </div>
  );
}
