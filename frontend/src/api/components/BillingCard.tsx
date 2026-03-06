import type { Reservation } from '../types/hotel';

type BillingCardProps = {
  reservation: Reservation;
};

export default function BillingCard({ reservation }: BillingCardProps) {
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(reservation.checkOutDate).getTime() - new Date(reservation.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
    )
  );

  return (
    <article className="billing-card" id="bill-card">
      <h3>Bill Summary</h3>
      <p><strong>Reservation:</strong> {reservation.reservationNo}</p>
      <p><strong>Guest:</strong> {reservation.guestName}</p>
      <p><strong>Room:</strong> {reservation.roomName}</p>
      <p><strong>Stay:</strong> {reservation.checkInDate} to {reservation.checkOutDate}</p>
      <p><strong>Nights:</strong> {nights}</p>
      <p><strong>Total:</strong> ${reservation.totalAmount.toFixed(2)}</p>
      <button type="button" className="btn btn-primary" onClick={() => window.print()}>Print bill</button>
    </article>
  );
}
