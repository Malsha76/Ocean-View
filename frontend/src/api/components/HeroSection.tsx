import { Link } from 'react-router-dom';
import { heroImage } from '../data/hotels';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <img src={heroImage} alt="Luxury resort" className="hero-banner" />
      <div className="hero-overlay" />
      <div className="hero-content container">
        <p className="kicker">Luxury Resort Experience</p>
        <h1>Escape to OceanView Hotel & Beach Resort</h1>
        <p>
          Discover premium rooms, stunning sea views, and effortless booking designed for travelers and teams.
        </p>
        <div className="hero-actions">
          <Link to="/reservations" className="btn btn-primary">Book your stay</Link>
          <Link to="/search" className="btn btn-light">Search rooms</Link>
        </div>
      </div>
    </section>
  );
}
