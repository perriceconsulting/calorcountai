import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  hasTouchscreen: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    hasTouchscreen: false
  });

  useEffect(() => {
    // Check for mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Check for touch screen
    const hasTouchscreen = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    setCapabilities({
      isMobile,
      hasTouchscreen
    });
  }, []);

  return capabilities;
}