import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

interface UserItem {
  id: string;
  username: string;
  role: string;
  enabled: boolean;
}

export default function Admin() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function loadUsers() {
    api<UserItem[]>('/admin/users').then(setUsers).catch(() => setUsers([]));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim(), password, role }),
      });
      setMessage('Staff account created.');
      showToast('success', 'Staff account created.');
      setUsername('');
      setPassword('');
      loadUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      setError(message);
      showToast('error', message);
    }
  }

  async function handleDisable(id: string) {
    setError('');
    try {
      await api(`/admin/users/${id}/disable`, { method: 'PATCH' });
      setMessage('Account disabled.');
      showToast('success', 'Account disabled.');
      loadUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed';
      setError(message);
      showToast('error', message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return;
    setError('');
    try {
      await api(`/admin/users/${id}`, { method: 'DELETE' });
      setMessage('User deleted.');
      showToast('success', 'User deleted.');
      loadUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed';
      setError(message);
      showToast('error', message);
    }
  }

  return (
    <>
      <p><Link to="/">← Back to menu</Link></p>
      <div className="card">
        <h2>Admin – Manage Staff Accounts</h2>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        <h3>Create staff account</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={100}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button type="submit">Create account</button>
        </form>
        <h3>Existing accounts</h3>
        {users.length === 0 ? <p>No users.</p> : (
          <table>
            <thead>
              <tr><th>Username</th><th>Role</th><th>Enabled</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>{u.enabled ? 'Yes' : 'No'}</td>
                  <td>
                    {u.enabled && <button type="button" onClick={() => handleDisable(u.id)}>Disable</button>}
                    <button type="button" onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
