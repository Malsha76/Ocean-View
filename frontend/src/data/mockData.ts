export type Role = 'PATIENT' | 'STAFF' | 'ADMIN';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Appointment = {
  id: string;
  appointmentNumber: string;
  patientName: string;
  patientEmail: string;
  condition: string;
  doctor: string;
  date: string;
  time: string;
  status: 'BOOKED' | 'CONFIRMED' | 'CANCELLED';
  consultationFee: number;
  extraServicesFee: number;
};

export type AuditLog = {
  id: string;
  action: string;
  actor: string;
  role: Role;
  at: string;
};

export type MealPlanResult = {
  condition: string;
  meals: string[];
  hydration: string;
  notes: string;
};

export type ProgressPoint = {
  month: string;
  weight: number;
  bloodPressure: string;
  activityScore: number;
};

export const imageUrls = {
  hero: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1600&q=80',
  wellness: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=900&q=80',
  clinic: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
};

export const dummyUsers: User[] = [
  { id: 'u-admin', name: 'System Admin', email: 'admin@hospital.com', role: 'ADMIN' },
  { id: 'u-staff', name: 'Nurse Silva', email: 'staff@hospital.com', role: 'STAFF' },
  { id: 'u-patient', name: 'Kamal Perera', email: 'patient@hospital.com', role: 'PATIENT' },
];

export const dummyAppointments: Appointment[] = [
  {
    id: 'ap-1',
    appointmentNumber: 'APT-1001',
    patientName: 'Kamal Perera',
    patientEmail: 'patient@hospital.com',
    condition: 'Diabetes follow-up',
    doctor: 'Dr. Jayasinghe',
    date: '2026-03-08',
    time: '09:30',
    status: 'BOOKED',
    consultationFee: 45,
    extraServicesFee: 10,
  },
  {
    id: 'ap-2',
    appointmentNumber: 'APT-1002',
    patientName: 'Nimali Senanayake',
    patientEmail: 'nimali@gmail.com',
    condition: 'Blood pressure review',
    doctor: 'Dr. Fernando',
    date: '2026-03-10',
    time: '14:00',
    status: 'CONFIRMED',
    consultationFee: 40,
    extraServicesFee: 5,
  },
];

export const dummyLogs: AuditLog[] = [
  { id: 'l-1', action: 'Login successful', actor: 'System Admin', role: 'ADMIN', at: '2026-03-05 09:20' },
  { id: 'l-2', action: 'Appointment created APT-1001', actor: 'Kamal Perera', role: 'PATIENT', at: '2026-03-05 10:12' },
  { id: 'l-3', action: 'Bill calculated for APT-1002', actor: 'Nurse Silva', role: 'STAFF', at: '2026-03-05 11:08' },
];

export const dummyProgress: ProgressPoint[] = [
  { month: 'Jan', weight: 74, bloodPressure: '130/85', activityScore: 58 },
  { month: 'Feb', weight: 73, bloodPressure: '126/82', activityScore: 64 },
  { month: 'Mar', weight: 72, bloodPressure: '122/80', activityScore: 71 },
  { month: 'Apr', weight: 71, bloodPressure: '120/78', activityScore: 76 },
];

export const dummyMealPlans: Record<string, MealPlanResult> = {
  diabetes: {
    condition: 'Diabetes',
    meals: ['Oats + nuts breakfast', 'Brown rice with grilled fish', 'Vegetable soup + salad dinner'],
    hydration: '2.5L water/day',
    notes: 'Avoid sugary drinks and refined carbohydrates.',
  },
  hypertension: {
    condition: 'Hypertension',
    meals: ['Fruit + low-fat yogurt', 'Steamed vegetables + lean protein', 'Whole grain dinner with greens'],
    hydration: '2L water/day',
    notes: 'Low sodium diet with regular potassium-rich foods.',
  },
  general: {
    condition: 'General wellness',
    meals: ['Protein-rich breakfast', 'Balanced lunch with vegetables', 'Light dinner before 8PM'],
    hydration: '2L water/day',
    notes: 'Keep consistent meal timings and daily walking.',
  },
};
