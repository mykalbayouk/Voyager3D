'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe3D } from '@/components/Globe/Globe3D';
import { GlobeControls } from '@/components/Globe/GlobeControls';
import { TravelForm } from '@/components/TravelPanel/TravelForm';
import { useTravelStore } from '@/hooks/useTravelData';
import { useGlobe } from '@/hooks/useGlobe';
import { storage } from '@/utils/storage';
import { COUNTRIES } from '@/utils/countryData';

export default function Home() {
  const { 
    selectedCountry, 
    setSelectedCountry, 
    updateTravelData, 
    getTravelData,
    markCountryAsPlanned,
    travelData 
  } = useTravelStore();
  
  const { autoRotate, toggleAutoRotate, resetView } = useGlobe();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize countries data and load saved travel data
  useEffect(() => {
    // Load saved travel data from localStorage
    const savedData = storage.loadAll();
    Object.entries(savedData).forEach(([countryCode, data]) => {
      updateTravelData(countryCode, data);
      markCountryAsPlanned(countryCode);
    });
    
    setIsLoading(false);
  }, [updateTravelData, markCountryAsPlanned]);

  const handleSaveTravelData = (countryCode: string, data: any) => {
    updateTravelData(countryCode, data);
    storage.save(countryCode, data);
    markCountryAsPlanned(countryCode);
    setSelectedCountry(null);
  };

  const handleClosePanel = () => {
    setSelectedCountry(null);
  };

  const selectedCountryData = selectedCountry ? COUNTRIES.find(c => c.code === selectedCountry) : null;
  const currentTravelData = selectedCountry ? getTravelData(selectedCountry) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-white text-lg">Loading Globe Travel...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      {/* Globe Section - 70% of screen */}
      <div className="flex-1 relative">
        <Globe3D />
        <GlobeControls
          onResetView={resetView}
          onToggleAutoRotate={toggleAutoRotate}
          autoRotate={autoRotate}
        />
        
        {/* Title Overlay */}
        <div className="absolute top-6 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass rounded-xl p-4"
          >
            <h1 className="text-2xl font-bold text-white">Globe Travel</h1>
            <p className="text-slate-300 text-sm">Click countries to plan your journey</p>
          </motion.div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-6 left-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass rounded-xl p-4"
          >
            <div className="text-white text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>Planned: {Object.keys(travelData).length} countries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                <span>Available: {COUNTRIES.length} countries</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Travel Panel - Slides in from right */}
      <AnimatePresence>
        {selectedCountry && selectedCountryData && currentTravelData && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[400px] h-full border-l border-slate-700 relative z-20"
          >
            <TravelForm
              countryCode={selectedCountry}
              countryName={selectedCountryData.name}
              travelData={currentTravelData}
              onSave={(data) => handleSaveTravelData(selectedCountry, data)}
              onClose={handleClosePanel}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
