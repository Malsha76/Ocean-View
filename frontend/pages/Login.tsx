import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Role } from '../types/hotel';

const roleRoutes: Record<Role, string> = {
  CUSTOMER: '/customer/dashboard',
  STAFF: '/staff/dashboard',
  ADMIN: '/admin/dashboard',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const user = await login({ email, password, role });
      showToast('success', 'Login successful');
      if (user.mustChangePassword) {
        navigate('/change-password');
        return;
      }
      navigate(roleRoutes[user.role]);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Login failed');
    }
  }

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={submit}
        onInvalidCapture={(event) => {
          event.preventDefault();
          const target = event.target as HTMLInputElement | HTMLSelectElement;
          if (target?.validationMessage) {
            showToast('error', target.validationMessage);
          }
        }}
      >
        <h1>Login</h1>
        <p className="meta">Access your hotel workspace by role.</p>

        <div className="field">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="CUSTOMER">Customer</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </div>

        <button type="submit" className="btn btn-primary">Login</button>

        <p className="meta center">
          New user? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
