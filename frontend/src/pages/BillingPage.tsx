import { useMemo, useState } from 'react';
import BillingCard from '../components/BillingCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function BillingPage() {
  const { reservations } = useAuth();
  const { showToast } = useToast();
  const [reservationId, setReservationId] = useState('');

  const selectedReservation = useMemo(
    () => reservations.find((item) => item.id === reservationId),
    [reservations, reservationId]
  );

  function generateBill() {
    if (!selectedReservation) return;
    showToast('success', 'Bill generated successfully');
  }

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Billing</h1>
        <p className="meta">Calculate totals and print customer bills.</p>

        <div className="billing-layout">
          <div className="field">
            <label>Select reservation</label>
            <select value={reservationId} onChange={(event) => setReservationId(event.target.value)}>
              <option value="">Select one</option>
              {reservations.map((reservation) => (
                <option key={reservation.id} value={reservation.id}>
                  {reservation.reservationNo} - {reservation.guestName}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-primary" onClick={generateBill} disabled={!selectedReservation}>
              Generate bill
            </button>
          </div>

          {selectedReservation ? <BillingCard reservation={selectedReservation} /> : null}
        </div>
      </main>
    </div>
  );
}
