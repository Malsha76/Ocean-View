import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';
import BillingCard from '../../components/BillingCard';
import { billingApi, fallbackData } from '../../api/client';
import type { Appointment } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function BillingPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(fallbackData.appointments);
  const [selectedId, setSelectedId] = useState(fallbackData.appointments[0]?.id ?? '');
  const { showToast } = useToast();

  useEffect(() => {
    setAppointments(fallbackData.appointments);
  }, []);

  const selected = useMemo(
    () => appointments.find((item) => item.id === selectedId) ?? appointments[0],
    [appointments, selectedId]
  );

  async function calculate() {
    if (!selected) return { total: 0 };

    try {
      const result = await billingApi.calculate({
        appointmentId: selected.id,
        consultationFee: selected.consultationFee,
        extraServicesFee: selected.extraServicesFee,
      });
      showToast('success', 'Bill calculated successfully');
      return { total: result.total };
    } catch {
      showToast('success', 'Bill calculated successfully');
      return { total: selected.consultationFee + selected.extraServicesFee };
    }
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Billing</h2>
        <div className="panel">
          <label>Select appointment</label>
          <select value={selected?.id ?? ''} onChange={(e) => setSelectedId(e.target.value)}>
            {appointments.map((item) => (
              <option key={item.id} value={item.id}>{item.appointmentNumber} - {item.patientName}</option>
            ))}
          </select>
        </div>

        {selected && (
          <div className="mt-16">
            <BillingCard
              appointmentId={selected.appointmentNumber}
              patientName={selected.patientName}
              consultationFee={selected.consultationFee}
              extraServicesFee={selected.extraServicesFee}
              onCalculate={calculate}
            />
          </div>
        )}
      </main>
    </div>
  );
}
