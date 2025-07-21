'use client';

import { StandardTravel as StandardTravelType } from '@/types/TravelObject';
import Input from '@/components/UI/Input';

interface StandardTravelProps {
  data: StandardTravelType;
  onChange: (data: StandardTravelType) => void;
}

export const StandardTravel = ({ data, onChange }: StandardTravelProps) => {
  const updateFlights = (field: string, value: string | number) => {
    onChange({
      ...data,
      flights: { ...data.flights, [field]: value },
    });
  };

  const updateAccommodation = (field: string, value: string | number) => {
    onChange({
      ...data,
      accommodation: { ...data.accommodation, [field]: value },
    });
  };

  const updateRentalCar = (field: string, value: string | number) => {
    onChange({
      ...data,
      transportation: {
        ...data.transportation,
        rentalCar: { ...data.transportation.rentalCar, [field]: value },
      },
    });
  };

  const updatePublicTransit = (field: string, value: string | string[]) => {
    onChange({
      ...data,
      transportation: {
        ...data.transportation,
        publicTransit: { ...data.transportation.publicTransit, [field]: value },
      },
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Flights Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          ✈️ Flight Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Departure Airport"
            value={data.flights.departure}
            onChange={(e) => updateFlights('departure', e.target.value)}
            placeholder="e.g., JFK, LAX"
          />
          <Input
            label="Arrival Airport"
            value={data.flights.arrival}
            onChange={(e) => updateFlights('arrival', e.target.value)}
            placeholder="e.g., CDG, FCO"
          />
          <Input
            label="Airline"
            value={data.flights.airline}
            onChange={(e) => updateFlights('airline', e.target.value)}
            placeholder="e.g., Delta, Air France"
          />
          <Input
            label="Price"
            type="number"
            value={data.flights.price}
            onChange={(e) => updateFlights('price', Number(e.target.value))}
            placeholder="0"
          />
          <Input
            label="Booking Reference"
            value={data.flights.bookingReference}
            onChange={(e) => updateFlights('bookingReference', e.target.value)}
            placeholder="Confirmation number"
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Accommodation Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🏨 Accommodation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Hotel Name"
            value={data.accommodation.hotelName}
            onChange={(e) => updateAccommodation('hotelName', e.target.value)}
            placeholder="Hotel name"
            className="md:col-span-2"
          />
          <Input
            label="Address"
            value={data.accommodation.address}
            onChange={(e) => updateAccommodation('address', e.target.value)}
            placeholder="Full address"
            className="md:col-span-2"
          />
          <Input
            label="Check-in Date"
            type="date"
            value={data.accommodation.checkIn}
            onChange={(e) => updateAccommodation('checkIn', e.target.value)}
          />
          <Input
            label="Check-out Date"
            type="date"
            value={data.accommodation.checkOut}
            onChange={(e) => updateAccommodation('checkOut', e.target.value)}
          />
          <Input
            label="Price per Night"
            type="number"
            value={data.accommodation.price}
            onChange={(e) => updateAccommodation('price', Number(e.target.value))}
            placeholder="0"
          />
          <Input
            label="Booking Reference"
            value={data.accommodation.bookingReference}
            onChange={(e) => updateAccommodation('bookingReference', e.target.value)}
            placeholder="Confirmation number"
          />
        </div>
      </div>

      {/* Transportation Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🚗 Transportation
        </h3>
        
        {/* Rental Car */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-slate-300">Rental Car</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Company"
              value={data.transportation.rentalCar.company}
              onChange={(e) => updateRentalCar('company', e.target.value)}
              placeholder="e.g., Hertz, Avis"
            />
            <Input
              label="Vehicle Type"
              value={data.transportation.rentalCar.vehicleType}
              onChange={(e) => updateRentalCar('vehicleType', e.target.value)}
              placeholder="e.g., Compact, SUV"
            />
            <Input
              label="Price per Day"
              type="number"
              value={data.transportation.rentalCar.price}
              onChange={(e) => updateRentalCar('price', Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        {/* Public Transit */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-slate-300">Public Transit</h4>
          <div className="space-y-4">
            <Input
              label="Transit Passes"
              value={data.transportation.publicTransit.passes.join(', ')}
              onChange={(e) => updatePublicTransit('passes', e.target.value.split(', ').filter(Boolean))}
              placeholder="e.g., Metro pass, Bus pass"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-300">
                Transit Notes
              </label>
              <textarea
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ease-in-out"
                rows={3}
                value={data.transportation.publicTransit.notes}
                onChange={(e) => updatePublicTransit('notes', e.target.value)}
                placeholder="Notes about public transportation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
