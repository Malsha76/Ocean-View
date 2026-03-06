import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { adminApi, fallbackData } from '../../api/client';
import type { AuditLog } from '../../data/mockData';

export default function AdminLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await adminApi.logs();
        setLogs(response);
      } catch {
        setLogs(fallbackData.logs);
      }
    }
    void load();
  }, []);

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Audit Logs</h2>
        <div className="panel table-wrap">
          <table>
            <thead><tr><th>Action</th><th>Actor</th><th>Role</th><th>Timestamp</th></tr></thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>{log.actor}</td>
                  <td>{log.role}</td>
                  <td>{log.at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
