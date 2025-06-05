import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, Booking } from '../services/bookingService';
import { roomService, Room } from '../services/roomService';
import BookingCard from '../components/booking/BookingCard';
import toast from 'react-hot-toast';
import { Search, FileQuestion, FileClock } from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch all bookings
      const { data: bookingsData, error: bookingsError } = await bookingService.getAllBookings();
      
      if (bookingsError) throw bookingsError;
      
      if (bookingsData) {
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
        
        // Get unique room IDs from bookings
        const roomIds = [...new Set(bookingsData.map(booking => booking.room_id))];
        
        // Fetch room details for each room ID
        const roomsMap: Record<string, Room> = {};
        
        for (const roomId of roomIds) {
          const { data } = await roomService.getRoomById(roomId);
          if (data) {
            roomsMap[roomId] = data;
          }
        }
        
        setRooms(roomsMap);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchEmail.trim()) {
      setFilteredBookings(bookings);
      return;
    }
    
    const filtered = bookings.filter(booking =>
      booking.guest_email.toLowerCase().includes(searchEmail.toLowerCase())
    );
    
    setFilteredBookings(filtered);
    
    if (filtered.length === 0) {
      toast.error('No bookings found for this email');
    } else {
      toast.success(`Found ${filtered.length} booking(s)`);
    }
  };
  
  const clearSearch = () => {
    setSearchEmail('');
    setFilteredBookings(bookings);
  };
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-primary-800 mb-3">Manage Your Bookings</h1>
      <p className="text-neutral-600 mb-8">
        View and manage all your bookings in one place.
      </p>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="form-group flex-grow mb-0">
            <label htmlFor="searchEmail" className="form-label">
              Find your bookings by email
            </label>
            <input
              type="email"
              id="searchEmail"
              className="input"
              placeholder="Enter your email address"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button type="submit" className="btn-primary whitespace-nowrap">
              <Search size={18} />
              <span>Search</span>
            </button>
            
            {searchEmail && (
              <button
                type="button"
                onClick={clearSearch}
                className="btn-outline whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Bookings List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse bg-white rounded-lg shadow-sm h-48"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-card p-8 text-center">
            <div className="flex justify-center mb-4">
              <FileQuestion size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Bookings Found</h3>
            <p className="text-neutral-600 mb-6">
              {searchEmail 
                ? `We couldn't find any bookings associated with "${searchEmail}"`
                : "You don't have any bookings yet."
              }
            </p>
            {searchEmail ? (
              <button onClick={clearSearch} className="btn-outline">
                Clear Search
              </button>
            ) : (
              <Link to="/rooms" className="btn-primary inline-flex">
                Browse Rooms to Book
              </Link>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary-800">
                {searchEmail 
                  ? `Showing ${filteredBookings.length} booking(s) for "${searchEmail}"`
                  : 'All Bookings'
                }
              </h2>
              {searchEmail && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Show all bookings
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {filteredBookings.map(booking => {
                const room = rooms[booking.room_id];
                
                if (!room) {
                  return null;
                }
                
                return (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    room={{
                      name: room.name,
                      type: room.type,
                      image_url: room.image_url
                    }}
                    onStatusChange={fetchData}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;