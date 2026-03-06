import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { adminApi, fallbackData } from '../../api/client';
import type { User } from '../../data/mockData';

export default function AdminDashboard() {
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const users = await adminApi.users();
        setStaffCount(users.filter((item) => item.role === 'STAFF').length);
      } catch {
        setStaffCount(fallbackData.users.filter((item) => item.role === 'STAFF').length);
      }
    }
    void load();
  }, []);

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Admin Dashboard</h2>
        <div className="grid-3">
          <article className="panel"><h3>Staff Accounts</h3><p>{staffCount} active staff profiles</p></article>
          <article className="panel"><h3>Audit Visibility</h3><p>Track security and operational actions in real time.</p></article>
          <article className="panel"><h3>Backup Readiness</h3><p>Export appointment CSV snapshots for compliance.</p></article>
        </div>
      </main>
    </div>
  );
}
