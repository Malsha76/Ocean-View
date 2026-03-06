import Navbar from '../../components/Navbar';

export default function StaffDashboard() {
  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <h2>Staff Dashboard</h2>
        <div className="grid-3">
          <article className="panel"><h3>Walk-in Appointments</h3><p>Add and manage consultations for walk-in and phone bookings.</p></article>
          <article className="panel"><h3>Billing Queue</h3><p>Calculate consultation + extra service fees and print receipts.</p></article>
          <article className="panel"><h3>Support Guide</h3><p>Open the Help page for onboarding and standard procedures.</p></article>
        </div>
      </main>
    </div>
  );
}
