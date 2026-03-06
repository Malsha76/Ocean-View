import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ManageStaffPage() {
  const { users, createStaffAccount, deleteStaffAccount } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const staffUsers = users.filter((user) => user.role === 'STAFF');

  async function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createStaffAccount({ name, email, password });
      setName('');
      setEmail('');
      setPassword('');
      showToast('success', 'Staff account created successfully');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Could not create staff account');
    }
  }

  function handleDeleteStaff(userId: string) {
    try {
      deleteStaffAccount(userId);
      showToast('success', 'Staff account deleted successfully');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Could not delete staff account');
    }
  }

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Manage Staff Accounts</h1>
        <p className="meta">Total staff accounts: {staffUsers.length}</p>

        <form
          className="reservation-form"
          onSubmit={handleAddStaff}
          onInvalidCapture={(event) => {
            event.preventDefault();
            const target = event.target as HTMLInputElement | HTMLSelectElement;
            if (target?.validationMessage) {
              showToast('error', target.validationMessage);
            }
          }}
        >
          <h3>Add new staff account</h3>
          <div className="grid-2">
            <div className="field">
              <label>Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="field">
            <label>Temporary password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add staff</button>
        </form>

        <div className="table-wrap" style={{ marginTop: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffUsers.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td>{staff.role}</td>
                  <td>
                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteStaff(staff.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
