import { Link } from 'react-router-dom';
import DashboardCard from '../../components/DashboardCard';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { currentUser, users, reservations } = useAuth();

  const staffCount = users.filter((user) => user.role === 'STAFF').length;
  const customerCount = users.filter((user) => user.role === 'CUSTOMER').length;

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Admin Dashboard</h1>
        <p className="meta">System management center for {currentUser?.name}.</p>

        <div className="dashboard-grid">
          <DashboardCard title="System users" value={users.length} />
          <DashboardCard title="Staff accounts" value={staffCount} />
          <DashboardCard title="Customers" value={customerCount} />
          <DashboardCard title="Reservations" value={reservations.length} />
        </div>

        <div className="action-row">
          <Link to="/reservation-list" className="btn btn-primary">View all reservations</Link>
          <Link to="/admin/users" className="btn btn-light">Manage system users</Link>
          <Link to="/admin/staff" className="btn btn-light">Manage staff accounts</Link>
        </div>
      </main>
    </div>
  );
}
