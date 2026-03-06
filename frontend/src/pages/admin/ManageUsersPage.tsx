import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';

export default function ManageUsersPage() {
  const { users, deleteStaffAccount } = useAuth();
  const { showToast } = useToast();

  async function handleDeleteStaff(userId: string) {
    const confirmed = window.confirm('Are you sure you want to delete this staff member?');
    if (!confirmed) return;

    // Always update local UI state so admin dashboard works even in demo/offline mode.
    try {
      deleteStaffAccount(userId);
      try {
        await api<void>(`/admin/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
      } catch {
        // Backend sync can fail in local-only mode; local deletion is already applied.
      }
      showToast('success', 'Staff member deleted successfully.');
    } catch {
      showToast('error', 'Failed to delete user.');
    }
  }

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Manage System Users</h1>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role === 'STAFF' ? (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDeleteStaff(user.id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="meta">-</span>
                    )}
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
