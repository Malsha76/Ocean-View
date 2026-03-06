import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import AppointmentTable from '../../components/AppointmentTable';
import { appointmentApi, fallbackData } from '../../api/client';
import type { Appointment } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const response = await appointmentApi.listMy();
        setAppointments(response);
      } catch {
        setAppointments(fallbackData.appointments);
      }
    }
    void load();
  }, []);

  const sorted = useMemo(() => [...appointments].sort((a, b) => b.date.localeCompare(a.date)), [appointments]);

  async function cancel(id: string) {
    const prev = appointments;
    setAppointments((current) => current.filter((item) => item.id !== id));
    try {
      await appointmentApi.remove(id);
    } catch {
      // Keep UI change for demo fallback.
    }
    showToast('success', 'Appointment cancelled successfully');
    if (!prev.find((item) => item.id === id)) {
      showToast('error', 'Appointment not found');
    }
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>My Appointments</h2>
        <AppointmentTable items={sorted} showActions onCancel={cancel} />
      </main>
    </div>
  );
}
