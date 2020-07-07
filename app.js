const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config({path: './config.env'});   // loads configuration variables
const EventEmitter = require('events')
const Logger = require('./logger');

const eventEmitter = new EventEmitter();
const logger = new Logger(process.env.LOGS);

// listens for 'file-write events'
eventEmitter.on('file-write', (file, timestamp) => {
    const logMSG = `File ${file} was updated at ${timestamp}`;
    logger.log(logMSG);
})

// DataProvider abstracts data-layer 
let data;
if (process.argv[2] === 'json') {
    console.log('Data Source: json files');
    const DataProvider = require('./persistent/json-data-provider');
    data = new DataProvider(path.resolve('./data'), eventEmitter);
} else {
    console.log('Data Source: MongoDB');
    const DataProvider = require('./persistent/mongo-data-provider');
    data = new DataProvider(process.env.MONGO_URL, process.env.MONGO_DB);
}

// DataProvider object is passed Router object
const usersRouter = require('./routes/users')(data);
const restaurantsRouter = require('./routes/restaurants')(data);
const reviewsRouter = require('./routes/reviews')(data);

const PORT = process.env.PORT;

const app = express();

// logs incoming requests
app.use( (req, res, next) => {
    const logMSG = `Incoming request from: ${req.socket.address().address}, Method: ${req.method} & URL: ${req.url}`;
    logger.log(logMSG);
    next();
})

// mounts routers
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/reviews', reviewsRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})