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

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const user = await signup({ name, email, password, role: 'CUSTOMER' });
      showToast('success', 'Signup successful');
      navigate(roleRoutes[user.role]);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Signup failed');
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
        <h1>Signup</h1>
        <p className="meta">Create your customer account.</p>

        <div className="field">
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        </div>

        <button type="submit" className="btn btn-primary">Create account</button>

        <p className="meta center">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
