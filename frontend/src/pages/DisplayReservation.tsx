import { useState } from 'react';
import { Link } from 'react-router-dom';
import { reservations, type ReservationResponse } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function DisplayReservation() {
  const { showToast } = useToast();
  const [number, setNumber] = useState('');
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setReservation(null);
    const num = number.trim();
    if (!num) {
      const message = 'Please enter reservation number.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const res = await reservations.getByNumber(num);
      setReservation(res);
      showToast('success', 'Reservation found');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reservation not found';
      setError(message);
      showToast('error', message);
    }
  }

  return (
    <>
      <p><Link to="/">← Back to menu</Link></p>
      <div className="card">
        <h2>Display Reservation Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reservation number</label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value.toUpperCase())}
              placeholder="e.g. RES-XXXXXXXX"
              pattern="^RES-[A-Z0-9]{4,}$"
              title="Use format like RES-ABC12345"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Search</button>
        </form>
        {reservation && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3>Reservation: {reservation.reservationNumber}</h3>
            <p><strong>Guest:</strong> {reservation.guestInfo?.guestName}</p>
            <p><strong>Address:</strong> {reservation.guestInfo?.address}</p>
            <p><strong>Contact:</strong> {reservation.guestInfo?.contactNumber}</p>
            <p><strong>Room type:</strong> {reservation.roomTypeCode}</p>
            <p><strong>Check-in:</strong> {reservation.checkInDate}</p>
            <p><strong>Check-out:</strong> {reservation.checkOutDate}</p>
            <p><strong>Status:</strong> {reservation.status}</p>
          </div>
        )}
      </div>
    </>
  );
}
