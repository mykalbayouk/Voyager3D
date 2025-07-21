'use client';

import { useState } from 'react';
import { CustomDetails as CustomDetailsType } from '@/types/TravelObject';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

interface CustomDetailsProps {
  data: CustomDetailsType;
  onChange: (data: CustomDetailsType) => void;
}

export const CustomDetails = ({ data, onChange }: CustomDetailsProps) => {
  const [newAttraction, setNewAttraction] = useState('');
  const [newRestaurant, setNewRestaurant] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const addItem = (type: 'attractions' | 'restaurants' | 'activities', value: string) => {
    if (value.trim()) {
      onChange({
        ...data,
        [type]: [...data[type], value.trim()],
      });
      
      // Clear the input
      if (type === 'attractions') setNewAttraction('');
      if (type === 'restaurants') setNewRestaurant('');
      if (type === 'activities') setNewActivity('');
    }
  };

  const removeItem = (type: 'attractions' | 'restaurants' | 'activities', index: number) => {
    onChange({
      ...data,
      [type]: data[type].filter((_, i) => i !== index),
    });
  };

  const updateNotes = (notes: string) => {
    onChange({ ...data, notes });
  };

  const updateBudget = (budget: number) => {
    onChange({ ...data, budget });
  };

  const ItemList = ({ 
    title, 
    items, 
    type, 
    newValue, 
    setNewValue 
  }: { 
    title: string;
    items: string[];
    type: 'attractions' | 'restaurants' | 'activities';
    newValue: string;
    setNewValue: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <h4 className="text-md font-medium text-slate-300">{title}</h4>
      
      {/* Add new item */}
      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Add ${title.toLowerCase().slice(0, -1)}`}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addItem(type, newValue);
            }
          }}
          className="flex-1"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => addItem(type, newValue)}
        >
          Add
        </Button>
      </div>

      {/* List items */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3">
              <span className="text-white">{item}</span>
              <button
                onClick={() => removeItem(type, index)}
                className="text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Budget */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          💰 Budget
        </h3>
        <Input
          label="Total Budget"
          type="number"
          value={data.budget}
          onChange={(e) => updateBudget(Number(e.target.value))}
          placeholder="0"
        />
      </div>

      {/* Attractions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🏛️ Places to Visit
        </h3>
        <ItemList
          title="Attractions"
          items={data.attractions}
          type="attractions"
          newValue={newAttraction}
          setNewValue={setNewAttraction}
        />
      </div>

      {/* Restaurants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🍽️ Dining
        </h3>
        <ItemList
          title="Restaurants"
          items={data.restaurants}
          type="restaurants"
          newValue={newRestaurant}
          setNewValue={setNewRestaurant}
        />
      </div>

      {/* Activities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🎯 Activities
        </h3>
        <ItemList
          title="Activities"
          items={data.activities}
          type="activities"
          newValue={newActivity}
          setNewValue={setNewActivity}
        />
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📝 Additional Notes
        </h3>
        <div className="space-y-1">
          <textarea
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ease-in-out"
            rows={4}
            value={data.notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Add any additional notes about your trip..."
          />
        </div>
      </div>
    </div>
  );
};
