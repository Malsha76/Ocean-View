import type { Room } from '../types/hotel';

export const heroImage =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80';

export const destinationImages = [
  {
    city: 'Galle Fort',
    description: 'Historic UNESCO heritage site with colonial architecture and ocean views.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
  },
  {
    city: 'Hikkaduwa Beach',
    description: 'Famous beach for surfing, snorkeling, and coral reefs.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    city: 'Mirissa',
    description: 'Beautiful tropical beach known for whale watching and relaxing sunsets.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80',
  },
  {
    city: 'Thalpe Beach',
    description: 'Quiet luxury beach with natural rock pools and scenic views.',
    image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80',
  },
];

export const roomInventory: Room[] = [
  {
    id: 'rm-1',
    name: 'Oceanfront Deluxe Suite',
    type: 'Deluxe',
    capacity: 2,
    location: 'Ocean Wing',
    pricePerNight: 195,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Sea View', 'King Bed', 'Breakfast', 'Smart TV'],
    available: true,
  },
  {
    id: 'rm-2',
    name: 'Golden Palm Family Room',
    type: 'Family',
    capacity: 4,
    location: 'Palm Block',
    pricePerNight: 260,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    amenities: ['2 Queen Beds', 'Balcony', 'Mini Bar', 'Pool Access'],
    available: true,
  },
  {
    id: 'rm-3',
    name: 'Royal Garden Villa',
    type: 'Villa',
    capacity: 6,
    location: 'Garden Residences',
    pricePerNight: 420,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Private Pool', 'Butler Service', 'Garden View', 'Lounge'],
    available: true,
  },
  {
    id: 'rm-4',
    name: 'Sunset Premium Room',
    type: 'Premium',
    capacity: 3,
    location: 'Sunset Tower',
    pricePerNight: 230,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Sunset View', 'Work Desk', 'Wi-Fi', 'Coffee Set'],
    available: true,
  },
];
