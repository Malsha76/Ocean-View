import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservations, roomTypes, type ReservationRequest, type RoomType } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function AddReservation() {
  const todayMinDate = new Date().toISOString().split('T')[0];
  const { showToast } = useToast();
  const [roomTypesList, setRoomTypesList] = useState<RoomType[]>([]);
  const [form, setForm] = useState<ReservationRequest>({
    guestName: '',
    address: '',
    contactNumber: '',
    roomTypeCode: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    roomTypes.list().then(setRoomTypesList).catch(() => setRoomTypesList([]));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(null);
    if (!form.roomTypeCode || !form.checkInDate || !form.checkOutDate) {
      const message = 'Please fill all fields.';
      setError(message);
      showToast('error', message);
      return;
    }
    if (!/^\d{10}$/.test(form.contactNumber.trim())) {
      const message = 'Contact number must be exactly 10 digits.';
      setError(message);
      showToast('error', message);
      return;
    }
    if (new Date(form.checkOutDate) <= new Date(form.checkInDate)) {
      const message = 'Check-out date must be after check-in date.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const res = await reservations.add(form);
      const message = `Reservation created. Reservation number: ${res.reservationNumber}`;
      setSuccess(message);
      showToast('success', message);
      setForm({ guestName: '', address: '', contactNumber: '', roomTypeCode: '', checkInDate: '', checkOutDate: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add reservation';
      setError(message);
      showToast('error', message);
    }
  }

  return (
    <>
      <p><Link to="/">← Back to menu</Link></p>
      <div className="card">
        <h2>Add New Reservation</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Guest name *</label>
            <input name="guestName" value={form.guestName} onChange={handleChange} minLength={2} required />
          </div>
          <div className="form-group">
            <label>Address *</label>
            <input name="address" value={form.address} onChange={handleChange} minLength={5} required />
          </div>
          <div className="form-group">
            <label>Contact number * (e.g. 0771234567)</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              inputMode="numeric"
              pattern="\d{10}"
              maxLength={10}
              title="Contact number must be exactly 10 digits"
              required
            />
          </div>
          <div className="form-group">
            <label>Room type *</label>
            <select name="roomTypeCode" value={form.roomTypeCode} onChange={handleChange} required>
              <option value="">Select...</option>
              {roomTypesList.map((rt) => (
                <option key={rt.id} value={rt.code}>{rt.name} – ${rt.ratePerNight}/night</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Check-in date *</label>
            <input type="date" name="checkInDate" min={todayMinDate} value={form.checkInDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Check-out date *</label>
            <input
              type="date"
              name="checkOutDate"
              value={form.checkOutDate}
              min={
                form.checkInDate
                  ? new Date(new Date(form.checkInDate).setDate(new Date(form.checkInDate).getDate() + 1)).toISOString().split('T')[0]
                  : undefined
              }
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Add reservation</button>
        </form>
      </div>
    </>
  );
}
