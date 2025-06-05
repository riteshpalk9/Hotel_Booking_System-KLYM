import React, { useState } from 'react';
import { Search, Users, Calendar } from 'lucide-react';

interface RoomFilterProps {
  onFilter: (filters: {
    checkIn: string;
    checkOut: string;
    guests: number;
    maxPrice?: number;
  }) => void;
}

const RoomFilter: React.FC<RoomFilterProps> = ({ onFilter }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      checkIn,
      checkOut,
      guests,
      maxPrice
    });
  };

  // Set minimum dates for check-in and check-out
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate tomorrow's date for minimum check-out
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  // Calculate minimum check-out based on selected check-in
  const minCheckOut = checkIn ? new Date(checkIn) : new Date(tomorrowString);
  minCheckOut.setDate(minCheckOut.getDate() + 1);
  const minCheckOutString = minCheckOut.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-card p-4 md:p-6">
      <h3 className="text-lg font-semibold text-primary-800 mb-4">Find Available Rooms</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-in Date */}
          <div className="form-group">
            <label htmlFor="check-in" className="form-label flex items-center gap-1">
              <Calendar size={16} />
              <span>Check-in Date</span>
            </label>
            <input
              type="date"
              id="check-in"
              className="input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              required
            />
          </div>

          {/* Check-out Date */}
          <div className="form-group">
            <label htmlFor="check-out" className="form-label flex items-center gap-1">
              <Calendar size={16} />
              <span>Check-out Date</span>
            </label>
            <input
              type="date"
              id="check-out"
              className="input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn ? minCheckOutString : tomorrowString}
              required
              disabled={!checkIn}
            />
          </div>

          {/* Number of Guests */}
          <div className="form-group">
            <label htmlFor="guests" className="form-label flex items-center gap-1">
              <Users size={16} />
              <span>Guests</span>
            </label>
            <select
              id="guests"
              className="select"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price (Optional) */}
          <div className="form-group">
            <label htmlFor="max-price" className="form-label flex items-center gap-1">
              <span>Max Price (optional)</span>
            </label>
            <input
              type="number"
              id="max-price"
              className="input"
              placeholder="Any price"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              min={0}
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="btn-primary w-full md:w-auto"
        >
          <Search size={18} />
          <span>Search Availability</span>
        </button>
      </form>
    </div>
  );
};

export default RoomFilter;