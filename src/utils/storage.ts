import { TravelObject } from '@/types/TravelObject';

const STORAGE_KEY = 'globe_travel_data';

export const storage = {
  save: (countryCode: string, data: TravelObject): void => {
    try {
      const existingData = storage.loadAll();
      existingData[countryCode] = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    } catch (error) {
      console.error('Failed to save travel data:', error);
    }
  },

  load: (countryCode: string): TravelObject | null => {
    try {
      const data = storage.loadAll();
      return data[countryCode] || null;
    } catch (error) {
      console.error('Failed to load travel data:', error);
      return null;
    }
  },

  loadAll: (): Record<string, TravelObject> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load all travel data:', error);
      return {};
    }
  },

  remove: (countryCode: string): void => {
    try {
      const existingData = storage.loadAll();
      delete existingData[countryCode];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    } catch (error) {
      console.error('Failed to remove travel data:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear travel data:', error);
    }
  },
};
