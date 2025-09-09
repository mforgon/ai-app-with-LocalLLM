import { sequelize } from '../config/database.js';
import Amenity from './Amenity.js';

// Initialize models
const models = {
  Amenity,
};

// Sync all models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

export { models, syncDatabase };