import Navbar from '../../components/Navbar';
import { imageUrls } from '../../data/mockData';

export default function PatientDashboard() {
  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section">
        <section className="hero-card">
          <img src={imageUrls.wellness} alt="Patient wellness" />
          <div>
            <h2>Patient Dashboard</h2>
            <p>Book preventive consultations, monitor appointments, and track your health progress.</p>
          </div>
        </section>
        <div className="grid-3">
          <article className="panel"><h3>Next Consultation</h3><p>Stay on schedule for preventive care and follow-ups.</p></article>
          <article className="panel"><h3>Meal Plan</h3><p>Generate personalized meal plans based on your condition.</p></article>
          <article className="panel"><h3>Progress Analytics</h3><p>Track monthly health indicators and activity goals.</p></article>
        </div>
      </main>
    </div>
  );
}
