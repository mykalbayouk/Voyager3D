export interface TravelObject {
  countryCode: string;
  countryName: string;
  lastUpdated: string;
  standardTravel: StandardTravel;
  customDetails: CustomDetails;
  aiGenerated: AiGenerated;
}

export interface StandardTravel {
  flights: Flights;
  accommodation: Accommodation;
  transportation: Transportation;
}

export interface Flights {
  departure: string;
  arrival: string;
  airline: string;
  price: number;
  bookingReference: string;
}

export interface Accommodation {
  hotelName: string;
  address: string;
  checkIn: string;
  checkOut: string;
  price: number;
  bookingReference: string;
}

export interface Transportation {
  rentalCar: RentalCar;
  publicTransit: PublicTransit;
}

export interface RentalCar {
  company: string;
  vehicleType: string;
  price: number;
}

export interface PublicTransit {
  passes: string[];
  notes: string;
}

export interface CustomDetails {
  attractions: string[];
  restaurants: string[];
  activities: string[];
  notes: string;
  budget: number;
  customFields: Record<string, any>;
}

export interface AiGenerated {
  suggestions: string[];
  lastGenerated: string;
}

export interface CountryData {
  code: string;
  name: string;
  lat: number;
  lng: number;
  planned: boolean;
}
