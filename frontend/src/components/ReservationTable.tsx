import type { Reservation } from '../types/hotel';

type ReservationTableProps = {
  reservations: Reservation[];
  canEdit?: boolean;
  canDelete?: boolean;
  canCancel?: boolean;
  onUpdate?: (reservationId: string) => void;
  onDelete?: (reservationId: string) => void;
  onCancel?: (reservationId: string) => void;
};

export default function ReservationTable({
  reservations,
  canEdit = false,
  canDelete = false,
  canCancel = false,
  onUpdate,
  onDelete,
  onCancel,
}: ReservationTableProps) {
  if (reservations.length === 0) {
    return <p className="empty-text">No reservations yet.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Reservation #</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.reservationNo}</td>
              <td>{reservation.guestName}</td>
              <td>{reservation.roomName}</td>
              <td>{reservation.checkInDate} - {reservation.checkOutDate}</td>
              <td>
                <span className={`status ${reservation.status.toLowerCase()}`}>{reservation.status}</span>
              </td>
              <td>${reservation.totalAmount.toFixed(2)}</td>
              <td className="actions-cell">
                {canEdit && onUpdate ? (
                  <button type="button" className="btn btn-subtle" onClick={() => onUpdate(reservation.id)}>Update</button>
                ) : null}
                {canDelete && onDelete ? (
                  <button type="button" className="btn btn-danger" onClick={() => onDelete(reservation.id)}>Delete</button>
                ) : null}
                {canCancel && onCancel && reservation.status !== 'CANCELLED' ? (
                  <button type="button" className="btn btn-subtle" onClick={() => onCancel(reservation.id)}>Cancel</button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
