'use client';

import { useEffect } from 'react';

export default function GoogleMapsLoader() {
  useEffect(() => {
    const handleScriptLoad = () => {
      console.log("Google Maps script loaded successfully");
    };

    const handleScriptError = () => {
      console.error("Error loading Google Maps script");
    };

    window.addEventListener('load', handleScriptLoad);
    window.addEventListener('error', handleScriptError);

    return () => {
      window.removeEventListener('load', handleScriptLoad);
      window.removeEventListener('error', handleScriptError);
    };
  }, []);

  return null;
} 