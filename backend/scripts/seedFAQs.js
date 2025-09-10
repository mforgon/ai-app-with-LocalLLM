import FAQ from '../models/FAQ.js';
import { sequelize } from '../config/database.js';

// Sample FAQs data
const faqsData = [
  {
    question: 'What are the check-in and check-out times?',
    answer: 'Check-in is at 3:00 PM and check-out is at 12:00 PM.',
    category: 'General',
  },
  {
    question: 'Do you have a swimming pool?',
    answer: 'Yes, we have an outdoor swimming pool with loungers and umbrellas. It is open from 7 AM to 10 PM daily.',
    category: 'Amenities',
  },
  {
    question: 'Is there a fitness center in the hotel?',
    answer: 'Yes, we have a fully equipped gym with cardio machines, free weights, and personal trainers available upon request.',
    category: 'Amenities',
  },
  {
    question: 'Do you offer spa services?',
    answer: 'Yes, we have a luxury spa offering massages, facials, and body treatments. Advance booking is required.',
    category: 'Amenities',
  },
  {
    question: 'Is there a restaurant in the hotel?',
    answer: 'Yes, we have an award-winning restaurant serving international cuisine with locally sourced ingredients.',
    category: 'Dining',
  },
  {
    question: 'Do you have a business center?',
    answer: 'Yes, we have a fully equipped business center with computers, printers, and meeting rooms.',
    category: 'Business',
  },
  {
    question: 'Do you provide airport shuttle service?',
    answer: 'Yes, we offer a complimentary shuttle service to and from the airport. It runs every hour from 6 AM to 10 PM.',
    category: 'Transportation',
  },
  {
    question: 'What is the price for the spa treatment?',
    answer: 'The spa treatment is $120 per session.',
    category: 'Pricing',
  },
  {
    question: 'Is the fitness center free for guests?',
    answer: 'Yes, the fitness center is free for all hotel guests.',
    category: 'Pricing',
  },
  {
    question: 'What are the hours for the rooftop bar?',
    answer: 'The rooftop bar is open from 5 PM to midnight.',
    category: 'Dining',
  },
];

// Function to seed the database
const seedFAQs = async () => {
  try {
    // Sync the database
    await sequelize.sync({ alter: true }); // This will not drop the table
    
    // Create FAQs
    await FAQ.bulkCreate(faqsData);
    
    console.log('FAQs data has been seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding FAQs data:', error);
    process.exit(1);
  }
};

seedFAQs();