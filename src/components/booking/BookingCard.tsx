import { format } from 'date-fns';
import { Calendar, Users, Tag } from 'lucide-react';
import { Booking } from '../../services/bookingService';
import { useState } from 'react';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';

interface BookingCardProps {
  booking: Booking;
  room: {
    name: string;
    type: string;
    image_url: string;
  };
  onStatusChange: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, room, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-success-50 text-success-600';
      case 'canceled':
        return 'bg-error-50 text-error-600';
      case 'completed':
        return 'bg-neutral-200 text-neutral-700';
      default:
        return 'bg-warning-50 text-warning-600';
    }
  };

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setIsLoading(true);
      try {
        const { error } = await bookingService.cancelBooking(booking.id);
        
        if (error) throw error;
        
        toast.success('Booking successfully canceled');
        onStatusChange();
      } catch (error) {
        toast.error('Failed to cancel booking');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Room Image */}
        <div className="w-full md:w-1/4 h-48 md:h-auto">
          <img 
            src={room.image_url} 
            alt={`${room.type} Room`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Booking Details */}
        <div className="w-full md:w-3/4 p-4 md:p-6 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-primary-800">{room.type} Room</h3>
              <p className="text-sm text-neutral-600">Room {room.name}</p>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-3 mt-2">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Calendar size={16} className="text-primary-600" />
              <span>Check-in: {formatDate(booking.check_in_date)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Calendar size={16} className="text-primary-600" />
              <span>Check-out: {formatDate(booking.check_out_date)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Users size={16} className="text-primary-600" />
              <span>{booking.number_of_guests} Guest{booking.number_of_guests !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Tag size={16} className="text-primary-600" />
              <span>Total: ${Number(booking.total_price).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 mt-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-700 font-medium">Booked by: {booking.guest_name}</p>
                <p className="text-xs text-neutral-500">
                  Booking made on {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={handleCancelBooking}
                  disabled={isLoading}
                  className="btn-danger text-xs px-3 py-1"
                >
                  {isLoading ? 'Canceling...' : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;