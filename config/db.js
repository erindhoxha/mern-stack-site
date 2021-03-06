// GET MONGOOSE
const mongoose = require('mongoose');
// GET CONFIG
const config = require('config');
// GET DB FROM MONGODB
const mongoURI = config.get('mongoURI');

const connectDB = async () => {
    try {
        // added useNewUrlParser just in case, older versions to support
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
        })
        console.log("MongoDB connected...");
    } catch (err) {
        console.log(err.message);
        // process.exit(1);
    }
}

module.exports = connectDB;