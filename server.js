const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect database
connectDB();

app.get('/', (req, res) => {
    res.send('API running');
})

// AFTER NPM RUN SERVER (NODEMON SERVER):
// GO TO POSTMAN, RUN GET AT http://localhost:5000 AND YOU'LL SEE THE "API RUNNING"
// maybe you forgot why? because app.get() it's creating a handler
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));