export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  description: string;
  capacity: number;
  base_price: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface Guest {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

export interface Booking {
  id: number;
  guest_id: number;
  room_type_id: number;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  guest?: Guest;
  room_type?: RoomType;
}

export interface AvailabilityResult {
  available: boolean;
  capacity: number;
  occupied: number;
  remaining: number;
  roomTypeId?: number;
}
