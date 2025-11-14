export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string | null;
  features: string[];
  capacity: number;
  is_available: boolean;
};

export type CartItem = {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
};

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  specialRequests: string;
}

export interface Booking extends BookingFormData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: string;
}
