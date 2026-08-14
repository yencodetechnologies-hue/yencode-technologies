require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Using URI:', uri ? uri.replace(/:.+@/, ':*****@') : '(none)');

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connection test: SUCCESS');
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('MongoDB connection test: FAILED');
    console.error(err);
    process.exit(1);
  });
