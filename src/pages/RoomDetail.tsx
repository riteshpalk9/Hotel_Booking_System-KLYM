import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Check, ArrowLeft } from 'lucide-react';
import { roomService, Room } from '../services/roomService';
import { differenceInDays, format, addDays } from 'date-fns';
import toast from 'react-hot-toast';

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  // Booking details state
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [checkInDate, setCheckInDate] = useState<string>(format(today, 'yyyy-MM-dd'));
  const [checkOutDate, setCheckOutDate] = useState<string>(format(tomorrow, 'yyyy-MM-dd'));
  const [numGuests, setNumGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await roomService.getRoomById(id);
        
        if (error) throw error;
        if (!data) throw new Error('Room not found');
        
        setRoom(data);
        
        // Initialize total price
        const days = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
        setTotalPrice(days * data.price);
      } catch (error) {
        console.error('Failed to fetch room details:', error);
        toast.error('Failed to load room details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [id]);
  
  // Calculate total price whenever dates change
  useEffect(() => {
    if (room) {
      const days = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
      if (days > 0) {
        setTotalPrice(days * room.price);
      }
    }
  }, [checkInDate, checkOutDate, room]);
  
  const handleCheckAvailability = async () => {
    if (!id) return;
    
    setIsCheckingAvailability(true);
    setIsAvailable(null);
    
    try {
      const { data, error } = await roomService.checkAvailability(
        id,
        checkInDate,
        checkOutDate
      );
      
      if (error) throw error;
      
      const available = data && data.length > 0;
      setIsAvailable(available);
      
      if (available) {
        toast.success('Room is available for the selected dates!');
      } else {
        toast.error('Room is not available for the selected dates');
      }
    } catch (error) {
      console.error('Failed to check availability:', error);
      toast.error('Failed to check availability');
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  const handleBookNow = () => {
    navigate(`/booking/${id}`, { 
      state: { 
        checkIn: checkInDate, 
        checkOut: checkOutDate,
        guests: numGuests
      } 
    });
  };
  
  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse">
          <div className="bg-neutral-200 h-64 w-full rounded-lg mb-6"></div>
          <div className="bg-neutral-200 h-10 w-1/3 rounded mb-4"></div>
          <div className="bg-neutral-200 h-6 w-full rounded mb-2"></div>
          <div className="bg-neutral-200 h-6 w-full rounded mb-2"></div>
          <div className="bg-neutral-200 h-6 w-3/4 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!room) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-800 mb-3">Room Not Found</h2>
          <p className="text-neutral-600 mb-6">The room you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/rooms')}
            className="btn-primary"
          >
            <ArrowLeft size={18} />
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft size={16} />
        <span>Back to rooms</span>
      </button>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Room Details */}
        <div className="w-full lg:w-2/3">
          {/* Room Image */}
          <div className="rounded-lg overflow-hidden shadow-md mb-6">
            <img
              src={room.image_url}
              alt={`${room.type} Room`}
              className="w-full h-80 object-cover"
            />
          </div>
          
          {/* Room Info */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-3xl font-bold text-primary-800">{room.type} Room</h1>
              <div className="text-xl font-semibold text-primary-600">${room.price.toFixed(2)} <span className="text-sm text-neutral-500">/ night</span></div>
            </div>
            
            <p className="text-neutral-700 mb-6">{room.description}</p>
            
            {/* Capacity */}
            <div className="flex items-center gap-2 text-neutral-600 mb-4">
              <Users size={18} className="text-primary-600" />
              <span>Capacity: Up to {room.capacity} guests</span>
            </div>
            
            {/* Amenities */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={16} className="text-primary-600" />
                    <span className="text-neutral-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-card overflow-hidden sticky top-24">
            <div className="bg-primary-700 text-white p-4">
              <h3 className="text-xl font-semibold">Check Availability & Book</h3>
            </div>
            
            <div className="p-6">
              <div className="form-group">
                <label htmlFor="check-in-detail" className="form-label flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Check-in Date</span>
                </label>
                <input
                  type="date"
                  id="check-in-detail"
                  className="input"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="check-out-detail" className="form-label flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Check-out Date</span>
                </label>
                <input
                  type="date"
                  id="check-out-detail"
                  className="input"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={format(addDays(new Date(checkInDate), 1), 'yyyy-MM-dd')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="guests-detail" className="form-label flex items-center gap-1">
                  <Users size={16} />
                  <span>Number of Guests</span>
                </label>
                <select
                  id="guests-detail"
                  className="select"
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number(e.target.value))}
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Calculation */}
              <div className="bg-neutral-50 p-3 rounded-md my-4">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-neutral-600">
                    ${room.price.toFixed(2)} x {differenceInDays(new Date(checkOutDate), new Date(checkInDate))} nights
                  </span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span className="text-primary-700">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckAvailability}
                  disabled={isCheckingAvailability}
                  className="btn-outline w-full"
                >
                  {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                </button>
                
                <button
                  onClick={handleBookNow}
                  disabled={!isAvailable}
                  className={`btn-primary w-full ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Book Now
                </button>
              </div>
              
              {isAvailable !== null && (
                <div className={`mt-4 p-3 rounded-md text-center ${
                  isAvailable 
                    ? 'bg-success-50 text-success-600' 
                    : 'bg-error-50 text-error-600'
                }`}>
                  {isAvailable 
                    ? 'Room is available for the selected dates!' 
                    : 'Room is not available for the selected dates.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;