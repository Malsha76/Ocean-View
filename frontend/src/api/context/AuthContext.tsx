import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { roomInventory } from '../data/hotels';
import type { AppUser, Reservation, ReservationFormInput, Role, Room } from '../types/hotel';

type SignupInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type LoginInput = {
  email: string;
  password: string;
  role: Role;
};

type AuthContextType = {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  users: AppUser[];
  rooms: Room[];
  reservations: Reservation[];
  signup: (payload: SignupInput) => Promise<AppUser>;
  login: (payload: LoginInput) => Promise<AppUser>;
  logout: () => void;
  addReservation: (payload: ReservationFormInput) => Reservation;
  updateReservation: (reservationId: string, payload: Partial<ReservationFormInput>) => Reservation;
  deleteReservation: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;
  createStaffAccount: (payload: { name: string; email: string; password: string }) => Promise<AppUser>;
  deleteStaffAccount: (userId: string) => void;
  changePassword: (payload: { currentPassword: string; newPassword: string }) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const USERS_STORAGE_KEY = 'oceanview_users';
const RESERVATIONS_STORAGE_KEY = 'oceanview_reservations';
const CURRENT_USER_STORAGE_KEY = 'oceanview_current_user';

const seededUsers: AppUser[] = [
  {
    id: 'u-admin',
    name: 'System Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'ADMIN',
    mustChangePassword: false,
    passwordHistory: ['admin123'],
  },
  {
    id: 'u-staff',
    name: 'Front Desk Officer',
    email: 'staff@oceanview.com',
    password: 'staff123',
    role: 'STAFF',
    mustChangePassword: false,
    passwordHistory: ['staff123'],
  },
  {
    id: 'u-customer',
    name: 'John Guest',
    email: 'customer@oceanview.com',
    password: 'customer123',
    role: 'CUSTOMER',
    mustChangePassword: false,
    passwordHistory: ['customer123'],
  },
];

function diffNights(checkInDate: string, checkOutDate: string) {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function validateStayDates(checkInDate: string, checkOutDate: string) {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid check-in or check-out date');
  }
  if (end <= start) {
    throw new Error('Check-out date must be after check-in date');
  }
}

function validateContactNumber(contactNumber: string) {
  if (!/^\d{10}$/.test(contactNumber.trim())) {
    throw new Error('Contact number must be exactly 10 digits');
  }
}

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) return seededUsers;
      const parsed = JSON.parse(raw) as AppUser[];
      return parsed.length > 0 ? parsed : seededUsers;
    } catch {
      return seededUsers;
    }
  });
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AppUser;
    } catch {
      return null;
    }
  });
  const [rooms] = useState<Room[]>(roomInventory);
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Reservation[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);

  async function signup(payload: SignupInput) {
    const { auth } = await import('../api/client');
    const email = payload.email.trim().toLowerCase();
    const result = await auth.signup(email, payload.password, payload.role);

    localStorage.setItem('token', result.token);
    localStorage.setItem('authToken', result.token);

    const role = (result.role || payload.role).toUpperCase() as Role;
    const user: AppUser = {
      id: `u-${Date.now()}`,
      name: payload.name.trim() || result.username,
      email: result.username,
      password: '',
      role,
      mustChangePassword: false,
      passwordHistory: [],
    };

    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase() && u.role === user.role);
      if (idx === -1) return [...prev, user];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...user };
      return copy;
    });
    setCurrentUser(user);
    return user;
  }

  async function login(payload: LoginInput) {
    const { auth } = await import('../api/client');
    const username = payload.email.trim().toLowerCase();
    const result = await auth.login(username, payload.password);
    const backendRole = (result.role || '').toUpperCase();
    if (backendRole !== payload.role) {
      throw new Error('Invalid credentials for selected role');
    }

    localStorage.setItem('token', result.token);
    localStorage.setItem('authToken', result.token);

    const existing = users.find((u) => u.email.toLowerCase() === result.username.toLowerCase() && u.role === payload.role);
    const user: AppUser = existing ?? {
      id: `u-${Date.now()}`,
      name: result.username,
      email: result.username,
      password: '',
      role: payload.role,
      mustChangePassword: false,
      passwordHistory: [],
    };

    setUsers((prev) => {
      if (prev.some((u) => u.email.toLowerCase() === user.email.toLowerCase() && u.role === user.role)) return prev;
      return [...prev, user];
    });
    setCurrentUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    setCurrentUser(null);
  }

  function addReservation(payload: ReservationFormInput) {
    if (!currentUser) throw new Error('Please login first');
    validateContactNumber(payload.contactNumber);
    validateStayDates(payload.checkInDate, payload.checkOutDate);
    const room = rooms.find((item) => item.id === payload.roomId);
    if (!room) throw new Error('Room not found');
    const nights = diffNights(payload.checkInDate, payload.checkOutDate);
    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      reservationNo: `RES-${randomCode()}`,
      roomId: room.id,
      roomName: room.name,
      guestName: payload.guestName.trim(),
      guestEmail: payload.guestEmail.trim().toLowerCase(),
      contactNumber: payload.contactNumber.trim(),
      checkInDate: payload.checkInDate,
      checkOutDate: payload.checkOutDate,
      guests: payload.guests,
      totalAmount: nights * room.pricePerNight,
      status: 'CONFIRMED',
      createdByRole: currentUser.role,
      createdByUserId: currentUser.id,
    };
    setReservations((prev) => [reservation, ...prev]);
    return reservation;
  }

  function updateReservation(reservationId: string, payload: Partial<ReservationFormInput>) {
    const existing = reservations.find((item) => item.id === reservationId);
    if (!existing) throw new Error('Reservation not found');
    const roomId = payload.roomId ?? existing.roomId;
    const room = rooms.find((item) => item.id === roomId);
    if (!room) throw new Error('Room not found');

    const updatedCheckIn = payload.checkInDate ?? existing.checkInDate;
    const updatedCheckOut = payload.checkOutDate ?? existing.checkOutDate;
    const updatedContactNumber = payload.contactNumber ?? existing.contactNumber;
    validateContactNumber(updatedContactNumber);
    validateStayDates(updatedCheckIn, updatedCheckOut);
    const nights = diffNights(updatedCheckIn, updatedCheckOut);

    const updated: Reservation = {
      ...existing,
      roomId,
      roomName: room.name,
      guestName: payload.guestName?.trim() ?? existing.guestName,
      guestEmail: payload.guestEmail?.trim().toLowerCase() ?? existing.guestEmail,
      contactNumber: payload.contactNumber?.trim() ?? existing.contactNumber,
      checkInDate: updatedCheckIn,
      checkOutDate: updatedCheckOut,
      guests: payload.guests ?? existing.guests,
      totalAmount: nights * room.pricePerNight,
    };

    setReservations((prev) => prev.map((item) => (item.id === reservationId ? updated : item)));
    return updated;
  }

  function deleteReservation(reservationId: string) {
    setReservations((prev) => prev.filter((item) => item.id !== reservationId));
  }

  function cancelReservation(reservationId: string) {
    setReservations((prev) =>
      prev.map((item) =>
        item.id === reservationId
          ? {
              ...item,
              status: 'CANCELLED',
            }
          : item
      )
    );
  }

  async function createStaffAccount(payload: { name: string; email: string; password: string }) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Only admins can create staff accounts');
    }

    const email = payload.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error('A user with this email already exists');
    }

    const { api } = await import('../api/client');
    const created = await api<{ id?: string; username: string; role: string }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        password: payload.password,
        role: 'STAFF',
      }),
    });

    const user: AppUser = {
      id: created.id ?? `u-${Date.now()}`,
      name: payload.name.trim(),
      email: created.username?.trim().toLowerCase() || email,
      password: payload.password,
      role: 'STAFF',
      mustChangePassword: true,
      passwordHistory: [payload.password],
    };

    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase() && u.role === user.role);
      if (idx === -1) return [...prev, user];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...user };
      return copy;
    });
    return user;
  }

  function deleteStaffAccount(userId: string) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Only admins can delete staff accounts');
    }

    const target = users.find((user) => user.id === userId);
    if (!target) {
      throw new Error('Staff account not found');
    }
    if (target.role !== 'STAFF') {
      throw new Error('Only staff accounts can be deleted here');
    }
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  }

  function changePassword(payload: { currentPassword: string; newPassword: string }) {
    if (!currentUser) throw new Error('Please login first');
    if (currentUser.password !== payload.currentPassword) {
      throw new Error('Current password is incorrect');
    }
    if (payload.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }
    if (payload.newPassword === currentUser.password) {
      throw new Error('New password cannot be the same as current password');
    }
    if (currentUser.passwordHistory.includes(payload.newPassword)) {
      throw new Error('You cannot reuse a previous temporary password');
    }

    const updatedUser: AppUser = {
      ...currentUser,
      password: payload.newPassword,
      mustChangePassword: false,
      passwordHistory: Array.from(new Set([...currentUser.passwordHistory, currentUser.password])),
    };

    setUsers((prev) => prev.map((user) => (user.id === currentUser.id ? updatedUser : user)));
    setCurrentUser(updatedUser);
  }

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      users,
      rooms,
      reservations,
      signup,
      login,
      logout,
      addReservation,
      updateReservation,
      deleteReservation,
      cancelReservation,
      createStaffAccount,
      deleteStaffAccount,
      changePassword,
    }),
    [currentUser, users, rooms, reservations]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
