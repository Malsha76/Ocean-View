import { Link } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function CustomerDashboard() {
  const { currentUser, reservations, rooms } = useAuth();

  const myReservations = reservations.filter((item) => item.guestEmail === currentUser?.email);
  const active = myReservations.filter((item) => item.status === 'CONFIRMED').length;

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Customer Dashboard</h1>
        <p className="meta">Welcome back, {currentUser?.name}.</p>

        <div className="dashboard-grid">
          <DashboardCard title="Available rooms" value={rooms.length} hint="Ready to reserve" />
          <DashboardCard title="My reservations" value={myReservations.length} hint="All bookings" />
          <DashboardCard title="Active stays" value={active} hint="Confirmed reservations" />
        </div>

        <div className="action-row">
          <Link to="/search" className="btn btn-primary">Search available rooms</Link>
          <Link to="/reservations" className="btn btn-light">Book reservation</Link>
          <Link to="/reservation-list" className="btn btn-light">View my reservations</Link>
        </div>
      </main>
    </div>
  );
}
