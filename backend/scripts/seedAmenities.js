import Amenity from '../models/Amenity.js';
import { sequelize } from '../config/database.js';

// Sample amenities data for a hotel
const amenitiesData = [
  {
    name: 'Swimming Pool',
    description: 'Outdoor swimming pool with loungers and umbrellas. Open from 7 AM to 10 PM daily.',
    category: 'Recreation',
    location: 'Ground Floor, East Wing',
    availability: true,
    price: 0, // Free for guests
    imageUrl: '/images/pool.jpg'
  },
  {
    name: 'Fitness Center',
    description: 'Fully equipped gym with cardio machines, free weights, and personal trainers available upon request.',
    category: 'Recreation',
    location: 'Level 2, West Wing',
    availability: true,
    price: 0, // Free for guests
    imageUrl: '/images/gym.jpg'
  },
  {
    name: 'Spa Treatment',
    description: 'Luxury spa offering massages, facials, and body treatments. Advance booking required.',
    category: 'Wellness',
    location: 'Level 3, North Wing',
    availability: true,
    price: 120, // $120 per session
    imageUrl: '/images/spa.jpg'
  },
  {
    name: 'Fine Dining Restaurant',
    description: 'Award-winning restaurant serving international cuisine with locally sourced ingredients.',
    category: 'Dining',
    location: 'Ground Floor, South Wing',
    availability: true,
    price: null, // Price varies
    imageUrl: '/images/restaurant.jpg'
  },
  {
    name: 'Business Center',
    description: 'Fully equipped business center with computers, printers, and meeting rooms.',
    category: 'Business',
    location: 'Level 1, West Wing',
    availability: true,
    price: 50, // $50 per hour for meeting rooms
    imageUrl: '/images/business.jpg'
  },
  {
    name: 'Airport Shuttle',
    description: 'Complimentary shuttle service to and from the airport. Runs every hour from 6 AM to 10 PM.',
    category: 'Transportation',
    location: 'Main Entrance',
    availability: true,
    price: 0, // Free for guests
    imageUrl: '/images/shuttle.jpg'
  },
  {
    name: 'Concierge Service',
    description: 'Personalized concierge service to assist with reservations, recommendations, and special requests.',
    category: 'Service',
    location: 'Lobby',
    availability: true,
    price: 0, // Free for guests
    imageUrl: '/images/concierge.jpg'
  },
  {
    name: 'Kids Club',
    description: 'Supervised activities for children aged 4-12. Open from 9 AM to 5 PM daily.',
    category: 'Family',
    location: 'Ground Floor, East Wing',
    availability: true,
    price: 25, // $25 per child per day
    imageUrl: '/images/kids.jpg'
  },
  {
    name: 'Rooftop Bar',
    description: 'Stylish rooftop bar offering craft cocktails and panoramic city views. Open from 5 PM to midnight.',
    category: 'Dining',
    location: 'Rooftop, Level 20',
    availability: true,
    price: null, // Price varies
    imageUrl: '/images/rooftop.jpg'
  },
  {
    name: 'Conference Room',
    description: 'Large conference room with state-of-the-art AV equipment. Capacity for up to 100 people.',
    category: 'Business',
    location: 'Level 2, South Wing',
    availability: true,
    price: 500, // $500 per day
    imageUrl: '/images/conference.jpg'
  }
];

// Function to seed the database
const seedAmenities = async () => {
  try {
    // Sync the database
    await sequelize.sync({ force: true }); // This will drop the table if it exists
    
    // Create amenities
    await Amenity.bulkCreate(amenitiesData);
    
    console.log('Amenities data has been seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding amenities data:', error);
    process.exit(1);
  }
};

seedAmenities();