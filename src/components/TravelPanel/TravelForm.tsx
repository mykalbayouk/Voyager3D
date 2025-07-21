'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TravelObject, StandardTravel as StandardTravelType, CustomDetails as CustomDetailsType } from '@/types/TravelObject';
import { StandardTravel } from './StandardTravel';
import { CustomDetails } from './CustomDetails';
import Button from '@/components/UI/Button';

interface TravelFormProps {
  countryCode: string;
  countryName: string;
  travelData: TravelObject;
  onSave: (data: TravelObject) => void;
  onClose: () => void;
}

export const TravelForm = ({
  countryCode,
  countryName,
  travelData,
  onSave,
  onClose,
}: TravelFormProps) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
  const [formData, setFormData] = useState<TravelObject>(travelData);

  // Update form data when travelData changes (when switching countries)
  useEffect(() => {
    setFormData(travelData);
  }, [travelData, countryCode]);

  const tabs = [
    { id: 'standard', label: 'Standard Travel', icon: '✈️' },
    { id: 'custom', label: 'Custom Details', icon: '📝' },
  ];

  const handleSave = () => {
    const updatedData = {
      ...formData,
      lastUpdated: new Date().toISOString(),
    };
    onSave(updatedData);
  };

  const updateFormData = (updates: Partial<TravelObject>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-md">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{countryName}</h2>
            <p className="text-sm text-slate-400">Plan your travel details</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mt-6 space-x-1 bg-slate-800/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'standard' | 'custom')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === 'standard' && (
              <StandardTravel
                data={formData.standardTravel}
                onChange={(standardTravel) => updateFormData({ standardTravel })}
              />
            )}
            {activeTab === 'custom' && (
              <CustomDetails
                data={formData.customDetails}
                onChange={(customDetails) => updateFormData({ customDetails })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-700 flex gap-3">
        <Button variant="accent" onClick={handleSave} className="flex-1">
          Save Travel Plan
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
