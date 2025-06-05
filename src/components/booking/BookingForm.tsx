import React, { useState, useEffect } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { Room } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Mail, Phone, User } from 'lucide-react';

interface BookingFormProps {
  room: Room;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  room, 
  checkIn: initialCheckIn, 
  checkOut: initialCheckOut, 
  guests: initialGuests 
}) => {
  const navigate = useNavigate();
  
  // Get today's date and tomorrow's date for min values
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];
  
  // Form state
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: initialCheckIn || today,
    checkOutDate: initialCheckOut || tomorrowString,
    numberOfGuests: initialGuests || 1
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(1);
  
  // Calculate total price and nights whenever check-in or check-out dates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const days = differenceInDays(
        parseISO(formData.checkOutDate),
        parseISO(formData.checkInDate)
      );
      
      if (days > 0) {
        setNights(days);
        setTotalPrice(days * room.price);
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, room.price]);
  
  // Calculate minimum check-out date based on selected check-in
  const minCheckOut = formData.checkInDate 
    ? new Date(new Date(formData.checkInDate).getTime() + 86400000).toISOString().split('T')[0]
    : tomorrowString;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create booking
      const { data, error } = await bookingService.createBooking({
        room_id: room.id,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        check_in_date: formData.checkInDate,
        check_out_date: formData.checkOutDate,
        number_of_guests: formData.numberOfGuests,
        total_price: totalPrice
      });
      
      if (error) throw error;
      
      toast.success('Booking created successfully!');
      
      // Redirect to booking confirmation page
      if (data) {
        navigate(`/booking/confirmation/${data.id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="bg-primary-700 text-white p-4">
        <h3 className="text-xl font-semibold">Book Your Stay</h3>
        <p className="text-primary-100 text-sm mt-1">
          {room.type} Room - ${room.price.toFixed(2)} per night
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Guest Information */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-primary-800 mb-3">Guest Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="guestName" className="form-label flex items-center gap-1">
                <User size={16} />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                id="guestName"
                name="guestName"
                className="input"
                value={formData.guestName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="guestEmail" className="form-label flex items-center gap-1">
                <Mail size={16} />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="guestEmail"
                name="guestEmail"
                className="input"
                value={formData.guestEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group md:col-span-2">
              <label htmlFor="guestPhone" className="form-label flex items-center gap-1">
                <Phone size={16} />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                id="guestPhone"
                name="guestPhone"
                className="input"
                value={formData.guestPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Stay Details */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-primary-800 mb-3">Stay Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="checkInDate" className="form-label flex items-center gap-1">
                <Calendar size={16} />
                <span>Check-in Date</span>
              </label>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                className="input"
                value={formData.checkInDate}
                onChange={handleInputChange}
                min={today}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="checkOutDate" className="form-label flex items-center gap-1">
                <Calendar size={16} />
                <span>Check-out Date</span>
              </label>
              <input
                type="date"
                id="checkOutDate"
                name="checkOutDate"
                className="input"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                min={minCheckOut}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="numberOfGuests" className="form-label flex items-center gap-1">
                <Users size={16} />
                <span>Number of Guests</span>
              </label>
              <select
                id="numberOfGuests"
                name="numberOfGuests"
                className="select"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
              >
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Price Summary */}
        <div className="bg-neutral-50 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-medium text-primary-800 mb-3">Price Summary</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">${room.price.toFixed(2)} x {nights} night{nights !== 1 ? 's' : ''}</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-neutral-200 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary-700">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </button>
        
        <p className="text-xs text-neutral-500 mt-4 text-center">
          By confirming this booking, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
};

export default BookingForm;