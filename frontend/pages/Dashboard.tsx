import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleExit() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Ocean View Resort – Front Desk</h1>
        <span>Logged in as <strong>{user?.username}</strong> ({user?.role})</span>
      </div>
      <div className="card">
        <h2>Main Menu</h2>
        <ul className="menu-list">
          <li><Link to="/reservations/add">Add new reservation</Link></li>
          <li><Link to="/reservations/display">Display reservation details</Link></li>
          <li><Link to="/billing">Calculate and print bill</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/help">Help (guidelines for new staff)</Link></li>
          {user?.role === 'ADMIN' && (
            <li><Link to="/admin">Admin – Manage staff accounts</Link></li>
          )}
          <li><button type="button" onClick={handleExit}>Exit system safely (Logout)</button></li>
        </ul>
      </div>
    </>
  );
}
