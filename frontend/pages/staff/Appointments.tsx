import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import AppointmentForm from '../../components/AppointmentForm';
import AppointmentTable from '../../components/AppointmentTable';
import SearchBar from '../../components/SearchBar';
import { appointmentApi, fallbackData } from '../../api/client';
import type { Appointment } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function StaffAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [query, setQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const result = await appointmentApi.listAll();
        setAppointments(result);
      } catch {
        setAppointments(fallbackData.appointments);
      }
    }
    void load();
  }, []);

  const filtered = useMemo(() => {
    const value = query.toLowerCase();
    if (!value) return appointments;
    return appointments.filter((item) => item.appointmentNumber.toLowerCase().includes(value));
  }, [appointments, query]);

  async function create(payload: Partial<Appointment>) {
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
      const created = await appointmentApi.create(payload);
      setAppointments((prev) => prev.map((item) => (item.id === optimistic.id ? created : item)));
    } catch {
      // keep fallback optimistic data
    }
    showToast('success', 'Appointment booked successfully');
  }

  async function cancel(id: string) {
    const prev = appointments;
    setAppointments((items) => items.map((item) => (item.id === id ? { ...item, status: 'CANCELLED' } : item)));
    try {
      await appointmentApi.update(id, { status: 'CANCELLED' });
    } catch {
      // preserve local update for demo
    }
    showToast('success', 'Appointment updated successfully');

    const exists = prev.some((item) => item.id === id);
    if (!exists) {
      showToast('error', 'Appointment not found');
    }
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Manage Appointments</h2>
        <AppointmentForm onSubmit={create} buttonText="Add appointment" />
        <div className="mt-16"><SearchBar value={query} onChange={setQuery} /></div>
        <div className="mt-16"><AppointmentTable items={filtered} showActions onCancel={cancel} /></div>
      </main>
    </div>
  );
}
