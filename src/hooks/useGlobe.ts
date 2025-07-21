import { useState, useCallback } from 'react';

export const useGlobe = () => {
  const [autoRotate, setAutoRotate] = useState(false);

  const toggleAutoRotate = useCallback(() => {
    setAutoRotate(prev => !prev);
  }, []);

  const resetView = useCallback(() => {
    // Call the global reset function if it exists
    if (typeof window !== 'undefined' && window.resetGlobeView) {
      window.resetGlobeView();
    }
    // Also stop auto-rotation when resetting
    setAutoRotate(false);
  }, []);

  return {
    autoRotate,
    toggleAutoRotate,
    resetView,
  };
};
