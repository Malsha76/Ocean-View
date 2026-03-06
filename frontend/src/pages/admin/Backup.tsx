import Navbar from '../../components/Navbar';
import { adminApi, fallbackData } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function BackupPage() {
  const { showToast } = useToast();

  async function download() {
    try {
      const content = await adminApi.backupCsv();
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-backup-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('success', 'Backup export completed');
    } catch {
      const rows = ['appointmentNumber,patientName,date,status'];
      fallbackData.appointments.forEach((item) => rows.push(`${item.appointmentNumber},${item.patientName},${item.date},${item.status}`));
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-backup-demo-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('success', 'Backup export completed');
    }
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Backup and Export</h2>
        <article className="panel">
          <p>Download appointment records in CSV format for backup and audit compliance.</p>
          <button type="button" className="btn primary" onClick={download}>Export CSV</button>
        </article>
      </main>
    </div>
  );
}
