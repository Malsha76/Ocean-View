import Navbar from '../components/Navbar';
import ReservationForm from '../components/ReservationForm';
import RoomCard from '../components/RoomCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { ReservationFormInput } from '../types/hotel';

export default function ReservationPage() {
  const { rooms, addReservation } = useAuth();
  const { showToast } = useToast();

  function handleSubmit(payload: ReservationFormInput) {
    try {
      addReservation(payload);
      showToast('success', 'Reservation booked successfully');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to create reservation');
    }
  }

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Reservation</h1>
        <p className="meta">Select your room and complete booking details.</p>

        <div className="layout-2">
          <section>
            <ReservationForm rooms={rooms} onSubmit={handleSubmit} />
          </section>

          <section>
            <h3>Available rooms</h3>
            <div className="room-stack">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
