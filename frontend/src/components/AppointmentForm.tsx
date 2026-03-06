import { useState } from 'react';
import type { Appointment } from '../data/mockData';

type AppointmentFormProps = {
  onSubmit: (payload: Partial<Appointment>) => Promise<void>;
  initial?: Partial<Appointment>;
  buttonText?: string;
};

export default function AppointmentForm({ onSubmit, initial, buttonText = 'Save appointment' }: AppointmentFormProps) {
  const [form, setForm] = useState<Partial<Appointment>>({
    patientName: initial?.patientName ?? '',
    patientEmail: initial?.patientEmail ?? '',
    condition: initial?.condition ?? '',
    doctor: initial?.doctor ?? '',
    date: initial?.date ?? '',
    time: initial?.time ?? '',
    consultationFee: initial?.consultationFee ?? 40,
    extraServicesFee: initial?.extraServicesFee ?? 0,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
    setForm({
      patientName: '',
      patientEmail: '',
      condition: '',
      doctor: '',
      date: '',
      time: '',
      consultationFee: 40,
      extraServicesFee: 0,
    });
  }

  return (
    <form className="panel" onSubmit={submit}>
      <div className="grid-2">
        <div className="field"><label>Patient Name</label><input value={form.patientName ?? ''} onChange={(e) => setForm((p) => ({ ...p, patientName: e.target.value }))} required /></div>
        <div className="field"><label>Patient Email</label><input type="email" value={form.patientEmail ?? ''} onChange={(e) => setForm((p) => ({ ...p, patientEmail: e.target.value }))} required /></div>
        <div className="field"><label>Condition</label><input value={form.condition ?? ''} onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value }))} required /></div>
        <div className="field"><label>Doctor</label><input value={form.doctor ?? ''} onChange={(e) => setForm((p) => ({ ...p, doctor: e.target.value }))} required /></div>
        <div className="field"><label>Date</label><input type="date" value={form.date ?? ''} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required /></div>
        <div className="field"><label>Time</label><input type="time" value={form.time ?? ''} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} required /></div>
        <div className="field"><label>Consultation Fee</label><input type="number" min={0} value={form.consultationFee ?? 0} onChange={(e) => setForm((p) => ({ ...p, consultationFee: Number(e.target.value) }))} /></div>
        <div className="field"><label>Extra Services Fee</label><input type="number" min={0} value={form.extraServicesFee ?? 0} onChange={(e) => setForm((p) => ({ ...p, extraServicesFee: Number(e.target.value) }))} /></div>
      </div>
      <button className="btn primary" type="submit">{buttonText}</button>
    </form>
  );
}
