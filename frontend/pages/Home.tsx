import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import RoomCard from '../components/RoomCard';
import { destinationImages } from '../data/hotels';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { rooms } = useAuth();

  return (
    <div className="page luxury-bg">
      <Navbar />
      <HeroSection />

      <section className="container section-space">
        <div className="section-title-row">
          <h2>Popular destinations</h2>
          <p>Explore the most beautiful coastal destinations in Southern Sri Lanka.</p>
        </div>
        <div className="dest-grid">
          {destinationImages.map((destination) => (
            <article key={destination.city} className="dest-card">
              <img src={destination.image} alt={destination.city} />
              <div className="dest-card-content">
                <h3>{destination.city}</h3>
                <p className="meta">{destination.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-space">
        <div className="section-title-row">
          <h2>Featured rooms</h2>
          <p>Elegant spaces with curated amenities and resort-level service.</p>
        </div>
        <div className="room-grid">
          {rooms.slice(0, 3).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
}
