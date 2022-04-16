// GET MONGOOSE
const mongoose = require('mongoose');
// GET CONFIG
const config = require('config');
// GET DB FROM MONGODB
const dbURI = config.get('mongoURI');

const connectDB = async () => {
    try {
        console.log("THIS IS THE DB URI", dbURI);
        await mongoose.connect(dbURI)
        console.log("MongoDB connected...");
    } catch (err) {
        console.log(err.message);
        // process.exit(1);
    }
}

module.exports = connectDB;