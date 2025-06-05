import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Users, Phone, Mail, ArrowRight, User } from 'lucide-react';
import { bookingService, Booking } from '../services/bookingService';
import { roomService, Room } from '../services/roomService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const BookingConfirmation = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      
      try {
        // Get booking details
        const { data: bookingData, error: bookingError } = await bookingService.getBookingById(bookingId);
        
        if (bookingError) throw bookingError;
        if (!bookingData) throw new Error('Booking not found');
        
        setBooking(bookingData);
        
        // Get room details
        const { data: roomData, error: roomError } = await roomService.getRoomById(bookingData.room_id);
        
        if (roomError) throw roomError;
        if (!roomData) throw new Error('Room not found');
        
        setRoom(roomData);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
        toast.error('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);
  
  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="bg-neutral-200 h-12 w-3/4 rounded-lg mb-6 mx-auto"></div>
          <div className="bg-neutral-200 h-6 w-1/2 rounded mb-8 mx-auto"></div>
          <div className="bg-neutral-200 h-64 w-full rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  if (!booking || !room) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-800 mb-3">Booking Not Found</h2>
          <p className="text-neutral-600 mb-6">We couldn't find the booking details you're looking for.</p>
          <Link to="/rooms" className="btn-primary">
            Browse Rooms
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        {/* Confirmation Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-success-50 text-success-600 p-3 rounded-full mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-primary-800 mb-3">Booking Confirmed!</h1>
          <p className="text-neutral-600">
            Your reservation has been successfully processed. You'll receive a confirmation email shortly.
          </p>
        </div>
        
        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden mb-8 animate-fadeIn">
          {/* Header with reference number */}
          <div className="bg-primary-800 text-white p-4 sm:p-6">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-primary-100">Confirmation #</div>
              <div className="font-mono font-semibold text-white">
                {booking.id.substring(0, 8).toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* Room summary with image */}
          <div className="p-4 sm:p-6 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                <img
                  src={room.image_url}
                  alt={`${room.type} Room`}
                  className="rounded-lg object-cover w-full h-32 sm:h-full"
                />
              </div>
              <div className="w-full sm:w-2/3 sm:pl-6">
                <h3 className="text-lg font-semibold text-primary-800 mb-1">{room.type} Room</h3>
                <p className="text-sm text-neutral-600 mb-3">{room.description.substring(0, 100)}...</p>
                <div className="flex justify-between text-sm border-t border-neutral-100 pt-2">
                  <span className="text-neutral-600">Price per night:</span>
                  <span className="font-medium">${room.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-neutral-600">Total amount:</span>
                  <span className="font-semibold text-primary-700">${Number(booking.total_price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stay details */}
          <div className="p-4 sm:p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-primary-800 mb-4">Stay Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Check-in</div>
                  <div className="text-neutral-600">
                    {format(new Date(booking.check_in_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-sm text-neutral-500">After 3:00 PM</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Check-out</div>
                  <div className="text-neutral-600">
                    {format(new Date(booking.check_out_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-sm text-neutral-500">Before 11:00 AM</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users size={18} className="text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Guests</div>
                  <div className="text-neutral-600">
                    {booking.number_of_guests} {booking.number_of_guests === 1 ? 'person' : 'people'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Guest details */}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-primary-800 mb-4">Guest Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-start gap-3">
                <User size={18} className="text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Guest Name</div>
                  <div className="text-neutral-600">{booking.guest_name}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Email</div>
                  <div className="text-neutral-600">{booking.guest_email}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-neutral-700">Phone</div>
                  <div className="text-neutral-600">{booking.guest_phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/bookings" className="btn-primary">
            <span>Manage Your Bookings</span>
            <ArrowRight size={18} />
          </Link>
          
          <Link to="/rooms" className="btn-outline">
            <span>Browse More Rooms</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;