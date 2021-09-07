const config = require('config');
const db = require('@paralect/node-mongo').connectDB(config.mongo.connection);

module.exports = db;
