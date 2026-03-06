import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const roleDashboard = currentUser
    ? currentUser.role === 'CUSTOMER'
      ? '/customer/dashboard'
      : currentUser.role === 'STAFF'
        ? '/staff/dashboard'
        : '/admin/dashboard'
    : '/';

  function handleExitSystem() {
    const confirmed = window.confirm('Are you sure you want to exit the system?');
    if (!confirmed) return;
    logout();
    showToast('success', 'You have successfully exited the system.');
    navigate('/login', { replace: true });
  }

  return (
    <header className="hotel-nav">
      <div className="container hotel-nav-inner">
        <Link to="/" className="hotel-logo">OceanView Luxury Resort</Link>
        <nav className="hotel-nav-links">
          <Link to="/">Home</Link>
          {currentUser ? <Link to={roleDashboard}>Dashboard</Link> : null}
          {currentUser?.role !== 'ADMIN' ? <Link to="/reservations">Reserve</Link> : null}
          {currentUser ? <Link to="/reservation-list">Reservation List</Link> : null}
          {currentUser?.role === 'STAFF' ? <Link to="/billing">Billing</Link> : null}
          {currentUser?.role === 'STAFF' ? <Link to="/help">Help</Link> : null}
          {currentUser ? (
            <button type="button" className="nav-action" onClick={handleExitSystem}>Exit System</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="nav-action">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
