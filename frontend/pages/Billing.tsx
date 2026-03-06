import { useState } from 'react';
import { Link } from 'react-router-dom';
import { billing, type BillResult } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Billing() {
  const { showToast } = useToast();
  const [reservationNumber, setReservationNumber] = useState('');
  const [bill, setBill] = useState<BillResult | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBill(null);
    const num = reservationNumber.trim();
    if (!num) {
      const message = 'Please enter reservation number.';
      setError(message);
      showToast('error', message);
      return;
    }
    try {
      const res = await billing.getBill(num);
      setBill(res);
      showToast('success', 'Bill calculated successfully');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reservation not found or error calculating bill';
      setError(message);
      showToast('error', message);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <p><Link to="/">← Back to menu</Link></p>
      <div className="card">
        <h2>Calculate and Print Bill</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reservation number</label>
            <input
              value={reservationNumber}
              onChange={(e) => setReservationNumber(e.target.value.toUpperCase())}
              placeholder="e.g. RES-XXXXXXXX"
              pattern="^RES-[A-Z0-9]{4,}$"
              title="Use format like RES-ABC12345"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Calculate bill</button>
        </form>
        {bill && (
          <div className="card" style={{ marginTop: '1rem' }} id="bill-receipt">
            <h3>Bill / Receipt</h3>
            <p><strong>Reservation:</strong> {bill.reservationNumber}</p>
            <p><strong>Guest:</strong> {bill.guestInfo?.guestName}</p>
            <p><strong>Room type:</strong> {bill.roomTypeCode}</p>
            <p><strong>Nights:</strong> {bill.nights}</p>
            <p><strong>Rate per night:</strong> ${Number(bill.ratePerNight).toFixed(2)}</p>
            <p><strong>Total:</strong> ${Number(bill.total).toFixed(2)}</p>
            <button type="button" onClick={handlePrint}>Print receipt</button>
          </div>
        )}
      </div>
    </>
  );
}
