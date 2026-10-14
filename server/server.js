const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const migrateExistingData = require('./config/migrateData');
const seedDatabase = require('./config/seed');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
connectDB()
  .then(async () => {
    // 1. Verify and safely migrate existing database records
    await migrateExistingData();

    // 2. Seed initial data if collections are empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
  });