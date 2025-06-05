import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { roomService, Room } from '../services/roomService';
import BookingForm from '../components/booking/BookingForm';
import toast from 'react-hot-toast';

interface LocationState {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

const Booking = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { checkIn, checkOut, guests } = location.state as LocationState || {};
  
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;
      
      try {
        const { data, error } = await roomService.getRoomById(roomId);
        
        if (error) throw error;
        if (!data) throw new Error('Room not found');
        
        setRoom(data);
      } catch (error) {
        console.error('Failed to fetch room details:', error);
        toast.error('Failed to load room details');
        navigate('/rooms');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [roomId, navigate]);
  
  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="bg-neutral-200 h-10 w-1/3 rounded mb-4"></div>
          <div className="bg-neutral-200 h-6 w-full rounded mb-2"></div>
          <div className="bg-neutral-200 h-64 w-full rounded-lg mt-6"></div>
        </div>
      </div>
    );
  }
  
  if (!room) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-800 mb-3">Room Not Found</h2>
          <p className="text-neutral-600 mb-6">We couldn't find the room you're looking for.</p>
          <Link to="/rooms" className="btn-primary">
            <ArrowLeft size={18} />
            Back to Rooms
          </Link>
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
        <span>Back to room details</span>
      </button>
      
      <h1 className="text-3xl font-bold text-primary-800 mb-3">Book Your Stay</h1>
      <p className="text-neutral-600 mb-8">Complete the form below to book your stay in our {room.type} Room.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Room Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <img
              src={room.image_url}
              alt={`${room.type} Room`}
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-primary-800 mb-1">{room.type} Room</h3>
              <p className="text-sm text-neutral-600 mb-3">{room.description.substring(0, 100)}...</p>
              
              <div className="text-sm text-neutral-600 space-y-2">
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span className="font-semibold">${room.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max capacity:</span>
                  <span>{room.capacity} guests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="lg:col-span-8">
          <BookingForm 
            room={room} 
            checkIn={checkIn} 
            checkOut={checkOut} 
            guests={guests} 
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;