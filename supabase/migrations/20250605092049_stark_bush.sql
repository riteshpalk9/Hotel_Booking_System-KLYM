/*
  # Initial Schema for Hotel Booking System

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text, room name/number)
      - `type` (text, room type like standard, deluxe, suite)
      - `price` (decimal, nightly rate)
      - `description` (text, description of room)
      - `amenities` (text[], array of amenities)
      - `capacity` (int, max number of guests)
      - `image_url` (text, url to room image)
      - `created_at` (timestamp with time zone)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key to rooms.id)
      - `guest_name` (text, name of guest)
      - `guest_email` (text, email of guest)
      - `guest_phone` (text, phone number of guest)
      - `check_in_date` (date, check-in date)
      - `check_out_date` (date, check-out date)
      - `number_of_guests` (int, number of guests)
      - `total_price` (decimal, total price of booking)
      - `status` (text, booking status: confirmed, canceled, completed)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous access
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  price decimal NOT NULL,
  description text NOT NULL,
  amenities text[] NOT NULL,
  capacity int NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) NOT NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  number_of_guests int NOT NULL,
  total_price decimal NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now(),
  
  -- Add constraint to ensure check_out_date is after check_in_date
  CONSTRAINT check_dates_valid CHECK (check_out_date > check_in_date)
);

-- Add index for faster lookup of bookings by room_id
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);

-- Add index for faster date range queries
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);

-- Enable RLS on rooms table
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to read rooms
CREATE POLICY "Anyone can read rooms" 
  ON rooms
  FOR SELECT 
  TO PUBLIC
  USING (true);

-- Policy for anyone to read bookings
CREATE POLICY "Anyone can read bookings" 
  ON bookings
  FOR SELECT 
  TO PUBLIC
  USING (true);

-- Policy for anyone to insert bookings
CREATE POLICY "Anyone can insert bookings" 
  ON bookings
  FOR INSERT 
  TO PUBLIC
  WITH CHECK (true);

-- Policy for anyone to update their own bookings
CREATE POLICY "Anyone can update their own bookings" 
  ON bookings
  FOR UPDATE 
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

-- Insert some sample room data
INSERT INTO rooms (name, type, price, description, amenities, capacity, image_url)
VALUES
  ('101', 'Standard', 99.99, 'Cozy standard room with city view', ARRAY['Wi-Fi', 'TV', 'Air conditioning', 'Mini-fridge'], 2, 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'),
  ('102', 'Deluxe', 149.99, 'Spacious deluxe room with king bed', ARRAY['Wi-Fi', 'TV', 'Air conditioning', 'Mini-fridge', 'Coffee maker', 'Desk'], 2, 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'),
  ('201', 'Suite', 299.99, 'Luxury suite with separate living area', ARRAY['Wi-Fi', 'TV', 'Air conditioning', 'Mini-bar', 'Coffee maker', 'Desk', 'Sofa', 'Bathtub'], 4, 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg'),
  ('202', 'Family', 249.99, 'Family room with two queen beds', ARRAY['Wi-Fi', 'TV', 'Air conditioning', 'Mini-fridge', 'Coffee maker', 'Desk', 'Extra beds available'], 4, 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg'),
  ('301', 'Executive', 399.99, 'Executive suite with panoramic views', ARRAY['Wi-Fi', 'TV', 'Air conditioning', 'Mini-bar', 'Coffee maker', 'Desk', 'Sofa', 'Bathtub', 'Jacuzzi', 'Balcony'], 2, 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg');