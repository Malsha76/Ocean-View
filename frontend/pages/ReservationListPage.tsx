import Navbar from '../components/Navbar';
import ReservationTable from '../components/ReservationTable';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ReservationListPage() {
  const { currentUser, reservations, cancelReservation, deleteReservation, updateReservation } = useAuth();
  const { showToast } = useToast();

  const visibleReservations =
    currentUser?.role === 'CUSTOMER'
      ? reservations.filter((item) => item.guestEmail === currentUser.email)
      : reservations;

  function handleCancel(id: string) {
    cancelReservation(id);
    showToast('success', 'Reservation updated successfully');
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm('Are you sure you want to delete this reservation?');
    if (!confirmed) return;
    deleteReservation(id);
    showToast('success', 'Reservation deleted successfully');
  }

  function handleUpdate(id: string) {
    const checkOutDate = window.prompt('Enter new check-out date (YYYY-MM-DD):');
    if (!checkOutDate) return;
    try {
      updateReservation(id, { checkOutDate });
      showToast('success', 'Reservation updated successfully');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to update reservation');
    }
  }

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Reservation list</h1>
        <p className="meta">Track, update, cancel, or delete reservations instantly.</p>

        <ReservationTable
          reservations={visibleReservations}
          canEdit={currentUser?.role !== 'CUSTOMER'}
          canDelete={currentUser?.role !== 'CUSTOMER'}
          canCancel={currentUser?.role === 'CUSTOMER'}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
