const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as Record<string, unknown>));
    const message =
      (typeof err.error === 'string' && err.error) ||
      (err.errors ? JSON.stringify(err.errors) : '') ||
      res.statusText ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const auth = {
  login: (username: string, password: string) =>
    api<{ token: string; username: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  signup: (username: string, password: string, role: string) =>
    api<{ token: string; username: string; role: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    }),
};

export interface ReservationRequest {
  guestName: string;
  address: string;
  contactNumber: string;
  roomTypeCode: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface ReservationResponse {
  id: string;
  reservationNumber: string;
  roomTypeCode: string;
  checkInDate: string;
  checkOutDate: string;
  guestInfo: { guestName: string; address: string; contactNumber: string };
  status: string;
}

export const reservations = {
  add: (data: ReservationRequest) =>
    api<ReservationResponse>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getByNumber: (number: string) =>
    api<ReservationResponse>(`/reservations/${encodeURIComponent(number)}`),
};

export interface BillResult {
  reservationNumber: string;
  nights: number;
  ratePerNight: number;
  total: number;
  guestInfo: { guestName: string; address: string; contactNumber: string };
  roomTypeCode: string;
}

export const billing = {
  getBill: (reservationNumber: string) =>
    api<BillResult>(`/billing/${encodeURIComponent(reservationNumber)}`),
};

export const reports = {
  dailyCheckIns: (date: string) =>
    api<ReservationResponse[]>(`/reports/daily-checkins?date=${date}`),
  byRoomType: (roomTypeCode: string) =>
    api<ReservationResponse[]>(`/reports/by-room-type?roomTypeCode=${roomTypeCode}`),
  upcomingCheckouts: (days?: number) =>
    api<ReservationResponse[]>(`/reports/upcoming-checkouts?days=${days ?? 7}`),
  revenue: (from: string, to: string) =>
    api<{ from: string; to: string; totalRevenue: number }>(`/reports/revenue?from=${from}&to=${to}`),
};

export const help = {
  get: () => api<{ content: string }>('/help'),
};

export interface RoomType {
  id: string;
  code: string;
  name: string;
  ratePerNight: number;
}

export const roomTypes = {
  list: () => api<RoomType[]>('/room-types'),
};
