import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { roomService, Room } from '../services/roomService';
import RoomCard from '../components/room/RoomCard';
import RoomFilter from '../components/room/RoomFilter';
import toast from 'react-hot-toast';
import { Filter } from 'lucide-react';

interface LocationState {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  maxPrice?: number;
}

const RoomList = () => {
  const location = useLocation();
  const locationState = location.state as LocationState || {};
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    dates: !!(locationState.checkIn && locationState.checkOut),
    guests: !!locationState.guests,
    price: !!locationState.maxPrice
  });
  
  // Load all rooms initially
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await roomService.getAllRooms();
        
        if (error) throw error;
        
        setRooms(data || []);
        setFilteredRooms(data || []);
        
        // Apply initial filters from location state
        if (locationState.checkIn && locationState.checkOut) {
          handleFilterChange({
            checkIn: locationState.checkIn,
            checkOut: locationState.checkOut,
            guests: locationState.guests || 1,
            maxPrice: locationState.maxPrice
          });
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        toast.error('Failed to load rooms. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  const handleFilterChange = async (filters: {
    checkIn: string;
    checkOut: string;
    guests: number;
    maxPrice?: number;
  }) => {
    setIsFiltering(true);
    
    try {
      // First, check room availability based on dates
      const { data, error } = await roomService.checkAvailability(
        null, // null means check all rooms
        filters.checkIn,
        filters.checkOut
      );
      
      if (error) throw error;
      
      let availableRooms = data || [];
      
      // Filter by number of guests if specified
      if (filters.guests) {
        availableRooms = availableRooms.filter(room => room.capacity >= filters.guests);
      }
      
      // Filter by max price if specified
      if (filters.maxPrice) {
        availableRooms = availableRooms.filter(room => room.price <= filters.maxPrice!);
      }
      
      setFilteredRooms(availableRooms);
      
      // Update active filters state
      setActiveFilters({
        dates: true,
        guests: !!filters.guests,
        price: !!filters.maxPrice
      });
      
      if (availableRooms.length === 0) {
        toast.error('No rooms available with the selected criteria');
      } else {
        toast.success(`Found ${availableRooms.length} available rooms`);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Error checking availability. Please try again.');
    } finally {
      setIsFiltering(false);
    }
  };
  
  const clearFilters = () => {
    setFilteredRooms(rooms);
    setActiveFilters({
      dates: false,
      guests: false,
      price: false
    });
  };
  
  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-primary-800 mb-3">Our Rooms</h1>
          <p className="text-neutral-600">
            Discover our selection of luxurious rooms designed for your comfort.
          </p>
        </div>
        
        {/* Room Filter */}
        <div className="mb-8">
          <RoomFilter onFilter={handleFilterChange} />
          
          {/* Active Filters */}
          {(activeFilters.dates || activeFilters.guests || activeFilters.price) && (
            <div className="mt-4 flex items-center">
              <span className="flex items-center text-sm text-neutral-600 mr-2">
                <Filter size={16} className="mr-1" />
                Active Filters:
              </span>
              
              <div className="flex flex-wrap gap-2">
                {activeFilters.dates && (
                  <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                    Dates
                  </span>
                )}
                
                {activeFilters.guests && (
                  <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                    Guests
                  </span>
                )}
                
                {activeFilters.price && (
                  <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                    Max Price
                  </span>
                )}
                
                <button 
                  onClick={clearFilters}
                  className="text-xs text-neutral-600 hover:text-error-600 ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Room List */}
        {isLoading || isFiltering ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-neutral-200 h-48 rounded-t-lg"></div>
                <div className="bg-white p-4 rounded-b-lg shadow-sm">
                  <div className="bg-neutral-200 h-6 rounded w-3/4 mb-3"></div>
                  <div className="bg-neutral-200 h-4 rounded w-1/2 mb-2"></div>
                  <div className="bg-neutral-200 h-4 rounded w-full mb-4"></div>
                  <div className="bg-neutral-200 h-10 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Rooms Available</h3>
            <p className="text-neutral-500 mb-6">
              We couldn't find any rooms matching your criteria. Try adjusting your filters.
            </p>
            <button 
              onClick={clearFilters} 
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;