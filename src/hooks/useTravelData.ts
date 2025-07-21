import { create } from 'zustand';
import { TravelObject, CountryData } from '@/types/TravelObject';
import { COUNTRIES } from '@/utils/countryData';

interface TravelStore {
  selectedCountry: string | null;
  travelData: Record<string, TravelObject>;
  savedCountries: Set<string>; // Track countries with actually saved data
  countries: CountryData[];
  
  // Actions
  setSelectedCountry: (countryCode: string | null) => void;
  updateTravelData: (countryCode: string, data: TravelObject) => void;
  getTravelData: (countryCode: string) => TravelObject | null;
  initializeCountryData: (countryCode: string) => void;
  markCountryAsPlanned: (countryCode: string) => void;
  markCountryAsSaved: (countryCode: string) => void;
}

const createEmptyTravelObject = (countryCode: string, countryName: string): TravelObject => ({
  countryCode,
  countryName,
  lastUpdated: new Date().toISOString(),
  standardTravel: {
    flights: {
      departure: '',
      arrival: '',
      airline: '',
      price: 0,
      bookingReference: '',
    },
    accommodation: {
      hotelName: '',
      address: '',
      checkIn: '',
      checkOut: '',
      price: 0,
      bookingReference: '',
    },
    transportation: {
      rentalCar: {
        company: '',
        vehicleType: '',
        price: 0,
      },
      publicTransit: {
        passes: [],
        notes: '',
      },
    },
  },
  customDetails: {
    attractions: [],
    restaurants: [],
    activities: [],
    notes: '',
    budget: 0,
    customFields: {},
  },
  aiGenerated: {
    suggestions: [],
    lastGenerated: '',
  },
});

export const useTravelStore = create<TravelStore>((set, get) => ({
  selectedCountry: null,
  travelData: {},
  savedCountries: new Set(),
  countries: COUNTRIES,

  setSelectedCountry: (countryCode) => set({ selectedCountry: countryCode }),

  updateTravelData: (countryCode, data) => 
    set((state) => ({
      travelData: {
        ...state.travelData,
        [countryCode]: {
          ...data,
          lastUpdated: new Date().toISOString(),
        },
      },
    })),

  getTravelData: (countryCode) => {
    const state = get();
    
    // If we already have data for this country, return it
    if (state.travelData[countryCode]) {
      return state.travelData[countryCode];
    }
    
    // If we don't have data, just return a new empty object without storing it
    // The storing will happen when the user actually saves data
    const country = state.countries.find(c => c.code === countryCode);
    if (country) {
      return createEmptyTravelObject(countryCode, country.name);
    }
    
    return null;
  },

  // Add a new function to initialize empty data for a country
  initializeCountryData: (countryCode: string) => {
    const state = get();
    
    // Only initialize if we don't already have data
    if (!state.travelData[countryCode]) {
      const country = state.countries.find(c => c.code === countryCode);
      if (country) {
        const newTravelData = createEmptyTravelObject(countryCode, country.name);
        set((currentState) => ({
          travelData: {
            ...currentState.travelData,
            [countryCode]: newTravelData,
          },
        }));
      }
    }
  },

  markCountryAsPlanned: (countryCode) =>
    set((state) => ({
      countries: state.countries.map(country =>
        country.code === countryCode
          ? { ...country, planned: true }
          : country
      ),
    })),

  markCountryAsSaved: (countryCode) =>
    set((state) => ({
      savedCountries: new Set([...state.savedCountries, countryCode])
    })),
}));
