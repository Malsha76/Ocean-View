import { Link } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function StaffDashboard() {
  const { currentUser, reservations, users } = useAuth();
  const confirmed = reservations.filter((item) => item.status === 'CONFIRMED').length;

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Staff Dashboard</h1>
        <p className="meta">Front desk workspace for {currentUser?.name}.</p>

        <div className="dashboard-grid">
          <DashboardCard title="Total reservations" value={reservations.length} />
          <DashboardCard title="Confirmed reservations" value={confirmed} />
          <DashboardCard title="Registered customers" value={users.filter((u) => u.role === 'CUSTOMER').length} />
        </div>

        <div className="action-row">
          <Link to="/reservations" className="btn btn-primary">Add reservation for guest</Link>
          <Link to="/reservation-list" className="btn btn-light">View / update reservations</Link>
          <Link to="/billing" className="btn btn-light">Calculate and print bills</Link>
          <Link to="/help" className="btn btn-light">Help section</Link>
        </div>
      </main>
    </div>
  );
}
