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
import { TravelObject } from '@/types/TravelObject';

export default function Home() {
  const { 
    selectedCountry, 
    setSelectedCountry, 
    updateTravelData, 
    getTravelData,
    initializeCountryData,
    markCountryAsPlanned,
    markCountryAsSaved,
    savedCountries
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
      markCountryAsSaved(countryCode); // Mark as saved since it's loaded from storage
    });
    
    setIsLoading(false);
  }, [updateTravelData, markCountryAsPlanned, markCountryAsSaved]);

  // Debug effect to track selectedCountry changes
  useEffect(() => {
    console.log('Main page: selectedCountry changed to:', selectedCountry);
    
    // Initialize country data when a country is selected
    if (selectedCountry) {
      initializeCountryData(selectedCountry);
    }
    
    const tempSelectedCountryData = selectedCountry ? COUNTRIES.find(c => c.code === selectedCountry) : null;
    const tempCurrentTravelData = selectedCountry ? getTravelData(selectedCountry) : null;
    console.log('Main page: selectedCountryData:', tempSelectedCountryData);
    console.log('Main page: currentTravelData:', tempCurrentTravelData);
  }, [selectedCountry, getTravelData, initializeCountryData]);

  const handleSaveTravelData = (countryCode: string, data: TravelObject) => {
    updateTravelData(countryCode, data);
    storage.save(countryCode, data);
    markCountryAsPlanned(countryCode);
    markCountryAsSaved(countryCode); // Mark as saved when user saves data
    setSelectedCountry(null);
  };

  const handleClosePanel = () => {
    setSelectedCountry(null);
  };

  const selectedCountryData = selectedCountry ? COUNTRIES.find(c => c.code === selectedCountry) : null;
  const currentTravelData = selectedCountry ? getTravelData(selectedCountry) : null;

  // Debug logs
  console.log('Selected country:', selectedCountry);
  console.log('Selected country data:', selectedCountryData);
  console.log('Current travel data:', currentTravelData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-white text-lg">Loading Globe Travel...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden relative">
      {/* Globe Section - 70% of screen */}
      <div className="flex-1 relative">
        <div className={`w-full h-full ${selectedCountry ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          <Globe3D autoRotate={autoRotate} onResetView={resetView} />
        </div>
        <GlobeControls
          onResetView={resetView}
          onToggleAutoRotate={toggleAutoRotate}
          autoRotate={autoRotate}
        />
        
        {/* Title Overlay */}
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
            
            {/* Quick Debug Info */}
            <div className="mt-2 text-xs text-slate-400">
              Selected: {selectedCountry || 'None'}
            </div>
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
                <span>Planned: {savedCountries.size} countries</span>
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
            className="absolute top-0 right-0 w-[400px] h-full border-l border-slate-700 z-50 pointer-events-auto"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
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
