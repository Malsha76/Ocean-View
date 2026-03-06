import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import { useAuth } from '../context/AuthContext';

export default function Search() {
  const { rooms } = useAuth();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rooms;
    return rooms.filter((room) =>
      `${room.name} ${room.type} ${room.location}`.toLowerCase().includes(needle)
    );
  }, [rooms, query]);

  return (
    <div className="page luxury-bg">
      <Navbar />
      <main className="container section-space">
        <h1>Search available rooms</h1>
        <div className="search-inline">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by room name, type, or location"
          />
        </div>

        <div className="room-grid">
          {results.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </main>
    </div>
  );
}
