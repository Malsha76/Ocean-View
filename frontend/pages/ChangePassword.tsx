import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('error', 'New password and confirm password do not match');
      return;
    }

    try {
      changePassword({ currentPassword, newPassword });
      showToast('success', 'Password changed successfully');
      navigate('/staff/dashboard', { replace: true });
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to change password');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Change Password</h1>
        <p className="meta">You must change your temporary password before continuing.</p>

        <div className="field">
          <label>Current temporary password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>

        <div className="field">
          <label>New password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required />
        </div>

        <div className="field">
          <label>Confirm new password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} required />
        </div>

        <button type="submit" className="btn btn-primary">Update password</button>
      </form>
    </div>
  );
}
