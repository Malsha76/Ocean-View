import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { imageUrls } from '../data/mockData';

export default function Landing() {
  return (
    <div className="page">
      <Navbar />
      <section className="hero medical-hero">
        <img src={imageUrls.hero} alt="Preventive healthcare" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="kicker">Preventive Health Management Platform</p>
          <h1>Healthy lives begin with proactive care</h1>
          <p className="lead">
            Book consultations, manage staff workflows, calculate billing, generate preventive meal plans, and monitor progress in one secure platform.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn primary">Get Started</Link>
            <Link to="/login" className="btn ghost-light">Login</Link>
          </div>
        </div>
      </section>

      <main className="container section">
        <div className="grid-3">
          <article className="panel"><h3>Patient Care</h3><p>Self-service appointment booking, meal plans, and personal progress analytics.</p></article>
          <article className="panel"><h3>Staff Operations</h3><p>Fast registration for walk-ins, appointment management, and billing workflow.</p></article>
          <article className="panel"><h3>Admin Control</h3><p>Staff account lifecycle, audit trail visibility, and CSV backup for compliance.</p></article>
        </div>
      </main>
    </div>
  );
}
