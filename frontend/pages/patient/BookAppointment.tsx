import { useState } from 'react';
import Navbar from '../../components/Navbar';
import AppointmentForm from '../../components/AppointmentForm';
import { appointmentApi, fallbackData } from '../../api/client';
import type { Appointment } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function BookAppointment() {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(fallbackData.appointments);

  async function handleCreate(payload: Partial<Appointment>) {
    const optimistic: Appointment = {
      id: `ap-${Date.now()}`,
      appointmentNumber: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: payload.patientName || 'Unknown',
      patientEmail: payload.patientEmail || 'unknown@mail.com',
      condition: payload.condition || 'General check',
      doctor: payload.doctor || 'Assigned doctor',
      date: payload.date || new Date().toISOString().slice(0, 10),
      time: payload.time || '09:00',
      status: 'BOOKED',
      consultationFee: payload.consultationFee ?? 40,
      extraServicesFee: payload.extraServicesFee ?? 0,
    };

    setAppointments((prev) => [optimistic, ...prev]);
    try {
      const saved = await appointmentApi.create(payload);
      setAppointments((prev) => prev.map((item) => (item.id === optimistic.id ? saved : item)));
    } catch {
      // keep optimistic fallback in demo mode
    }
    showToast('success', 'Appointment booked successfully');
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Book Appointment</h2>
        <AppointmentForm onSubmit={handleCreate} buttonText="Book appointment" />
        <div className="panel mt-16">
          <h3>Latest Booking</h3>
          <p className="muted">Most recent appointment number: {appointments[0]?.appointmentNumber ?? '-'}</p>
        </div>
      </main>
    </div>
  );
}
