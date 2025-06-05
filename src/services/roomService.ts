import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

export type Room = Database['public']['Tables']['rooms']['Row'];
export type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
export type RoomUpdate = Database['public']['Tables']['rooms']['Update'];

export const roomService = {
  // Get all rooms
  async getAllRooms(): Promise<{ data: Room[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('price', { ascending: true });
    
    return { data, error };
  },

  // Get a specific room by ID
  async getRoomById(id: string): Promise<{ data: Room | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Create a new room
  async createRoom(room: RoomInsert): Promise<{ data: Room | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('rooms')
      .insert([room])
      .select()
      .single();
    
    return { data, error };
  },

  // Update an existing room
  async updateRoom(id: string, updates: RoomUpdate): Promise<{ data: Room | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Delete a room
  async deleteRoom(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Check room availability for given dates
  async checkAvailability(
    roomId: string | null,
    checkInDate: string,
    checkOutDate: string
  ): Promise<{ data: Room[] | null; error: Error | null }> {
    // First get all bookings that overlap with the requested dates
    const { data: overlappingBookings, error: bookingError } = await supabase
      .from('bookings')
      .select('room_id')
      .not('status', 'eq', 'canceled')
      .or(
        `check_in_date.lt.${checkOutDate},check_out_date.gt.${checkInDate}`
      );
    
    if (bookingError) {
      return { data: null, error: bookingError };
    }

    // Get the rooms that are NOT in the overlapping bookings
    let query = supabase.from('rooms').select('*');
    
    // If roomId is provided, only check that specific room
    if (roomId) {
      query = query.eq('id', roomId);
    }
    
    // Exclude rooms with overlapping bookings
    if (overlappingBookings && overlappingBookings.length > 0) {
      const bookedRoomIds = overlappingBookings.map(booking => booking.room_id);
      query = query.not('id', 'in', `(${bookedRoomIds.join(',')})`);
    }
    
    const { data, error } = await query;
    
    return { data, error };
  }
};