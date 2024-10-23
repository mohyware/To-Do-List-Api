// 3rd party libraries
//const dotenv = require('dotenv');
const mongoose = require('mongoose');

//const env = process.env.NODE_ENV || 'development';
// Load the appropriate .env file
//dotenv.config({ path: `.env.${env}` });

// database connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {})
  .then(() => {
    console.log(`connected successfully to DB: ${process.env.DB_NAME}`);
  })
  .catch((error) => console.log(`failed to connect to DB: ${error}`));

module.exports = mongoose;