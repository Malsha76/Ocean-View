import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { adminApi, fallbackData } from '../../api/client';
import type { User } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function StaffAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const response = await adminApi.users();
        setUsers(response);
      } catch {
        setUsers(fallbackData.users);
      }
    }
    void load();
  }, []);

  async function createStaff(e: React.FormEvent) {
    e.preventDefault();
    const optimistic: User = { id: `u-${Date.now()}`, name, email, role: 'STAFF' };
    setUsers((prev) => [optimistic, ...prev]);

    try {
      const created = await adminApi.createStaff({ name, email, password });
      setUsers((prev) => prev.map((user) => (user.id === optimistic.id ? created : user)));
    } catch {
      // keep optimistic item in demo mode
    }

    showToast('success', 'Staff account created successfully');
    setName('');
    setEmail('');
    setPassword('');
  }

  async function remove(id: string) {
    setUsers((prev) => prev.filter((item) => item.id !== id));
    try {
      await adminApi.disableOrDelete(id);
    } catch {
      // local fallback already removed
    }
    showToast('success', 'Staff account removed successfully');
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Staff Account Management</h2>
        <form className="panel grid-3" onSubmit={createStaff}>
          <div className="field"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <button type="submit" className="btn primary">Create Staff</button>
        </form>

        <div className="panel mt-16 table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
            <tbody>
              {users.filter((item) => item.role === 'STAFF').map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><button type="button" className="btn danger" onClick={() => remove(user.id)}>Disable/Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
