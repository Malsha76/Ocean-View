import type { Room } from '../types/hotel';

type RoomCardProps = {
  room: Room;
  onBook?: (roomId: string) => void;
};

export default function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <article className="room-card">
      <img src={room.image} alt={room.name} />
      <div className="room-card-content">
        <p className="meta">{room.type} · {room.location}</p>
        <h3>{room.name}</h3>
        <p className="meta">Up to {room.capacity} guests</p>
        <p className="price">${room.pricePerNight} <span>/ night</span></p>
        <ul>
          {room.amenities.slice(0, 3).map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>
        {onBook ? (
          <button type="button" className="btn btn-primary" onClick={() => onBook(room.id)}>
            Book now
          </button>
        ) : null}
      </div>
    </article>
  );
}
