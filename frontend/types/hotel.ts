export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  mustChangePassword: boolean;
  passwordHistory: string[];
};

export type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  pricePerNight: number;
  image: string;
  amenities: string[];
  available: boolean;
};

export type ReservationStatus = 'CONFIRMED' | 'CANCELLED';

export type Reservation = {
  id: string;
  reservationNo: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  contactNumber: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  status: ReservationStatus;
  createdByRole: Role;
  createdByUserId: string;
};

export type ReservationFormInput = {
  roomId: string;
  guestName: string;
  guestEmail: string;
  contactNumber: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
};
