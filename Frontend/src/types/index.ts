export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  capacity: number;
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

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
};
