const express = require('express');
const http = require('http');

const usersRouter = require('./routes/users');
const restaurantsRouter = require('./routes/restaurants');
const reviewsRouter = require('./routes/reviews');

const PORT = 3000;

const app = express();

// mounts routers
app.use('/api/users', usersRouter);
// app.use('/api/restaurants', restaurantsRouter);
// app.use('/api/reviews', reviewsRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})