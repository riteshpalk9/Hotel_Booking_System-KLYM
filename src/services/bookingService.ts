import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { roomService } from './roomService';
import { differenceInDays, parseISO } from 'date-fns';

export type Booking = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export const bookingService = {
  // Create a new booking
  async createBooking(booking: Omit<BookingInsert, 'total_price'>): Promise<{ data: Booking | null; error: Error | null }> {
    // Check room availability first
    const { data: availableRooms, error: availabilityError } = await roomService.checkAvailability(
      booking.room_id,
      booking.check_in_date,
      booking.check_out_date
    );

    if (availabilityError) {
      return { data: null, error: availabilityError };
    }

    if (!availableRooms || availableRooms.length === 0) {
      return { 
        data: null, 
        error: new Error('Room is not available for the selected dates') 
      };
    }

    // Get room details to calculate total price
    const { data: room, error: roomError } = await roomService.getRoomById(booking.room_id);
    
    if (roomError || !room) {
      return { data: null, error: roomError || new Error('Room not found') };
    }

    // Calculate number of nights
    const nights = differenceInDays(
      parseISO(booking.check_out_date),
      parseISO(booking.check_in_date)
    );

    // Calculate total price
    const totalPrice = room.price * nights;

    // Create the booking with calculated total price
    const bookingWithTotalPrice: BookingInsert = {
      ...booking,
      total_price: totalPrice
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingWithTotalPrice])
      .select()
      .single();
    
    return { data, error };
  },

  // Get a specific booking by ID
  async getBookingById(id: string): Promise<{ data: Booking | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Get all bookings
  async getAllBookings(): Promise<{ data: Booking[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Get bookings by room ID
  async getBookingsByRoomId(roomId: string): Promise<{ data: Booking[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_id', roomId)
      .order('check_in_date', { ascending: true });
    
    return { data, error };
  },

  // Cancel a booking
  async cancelBooking(id: string): Promise<{ data: Booking | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'canceled' })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Update a booking
  async updateBooking(id: string, updates: BookingUpdate): Promise<{ data: Booking | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }
};