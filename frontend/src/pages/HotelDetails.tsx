import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { hotels } from '../data/hotels';

export default function HotelDetails() {
  const { id } = useParams();
  const hotel = hotels.find((item) => item.id === id);

  if (!hotel) {
    return (
      <div className="page page-soft">
        <Navbar />
        <main className="container section-gap">
          <div className="empty-state">
            <h2>Hotel not found</h2>
            <p>The selected hotel does not exist in the demo dataset.</p>
            <Link to="/search" className="primary-btn">Back to search</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page page-soft">
      <Navbar />
      <main className="container section-gap details-layout">
        <section>
          <p className="hotel-location">{hotel.location}</p>
          <h1 className="details-title">{hotel.name}</h1>
          <div className="details-gallery">
            {hotel.gallery.map((image, index) => (
              <img key={image} src={image} alt={`${hotel.name} ${index + 1}`} />
            ))}
          </div>

          <article className="details-card">
            <h3>About this hotel</h3>
            <p>{hotel.description}</p>
            <h3>Amenities</h3>
            <ul className="amenities-list">
              {hotel.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </article>
        </section>

        <aside className="booking-card">
          <p className="rating">{hotel.rating.toFixed(1)} / 5 ({hotel.reviews} reviews)</p>
          <h3>${hotel.pricePerNight} <span>per night</span></h3>
          <div className="field">
            <label>Check-in</label>
            <input type="date" />
          </div>
          <div className="field">
            <label>Check-out</label>
            <input type="date" />
          </div>
          <div className="field">
            <label>Guests</label>
            <input type="number" min={1} defaultValue={2} />
          </div>
          <button type="button" className="primary-btn wide">Reserve now</button>
          <p className="muted">You will connect this button to your booking API later.</p>
        </aside>
      </main>
    </div>
  );
}
