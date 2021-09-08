const { MongoClient } = require('mongodb');
// const _ = require('lodash');

const MongoService = require('./mongo-service');
const MongoQueryService = require('./mongo-query-service');

// const logger = global.logger || console;

const connect = (connectionString) => {
  const client = new MongoClient(connectionString);

  client.connect();

  const db = client.db();

  console.log(`
    
    DATABASE
    
    `, db);

  db.createService = (collectionName, options = {}) => {
    // const collection = db.get(collectionName, { castIds: false });
    const collection = db.collection(collectionName);

    return new MongoService(collection, options);
  };

  // const db = monk(connectionString, connectionSettings);
  // const client = new MongoClient(uri);

  // db.on('error-opening', (err) => {
  //   logger.error(err, 'Failed to connect to the mongodb on start');
  //   throw err;
  // });

  // db.on('fullsetup', () => {
  //   logger.info(`Connected to mongodb: ${connectionString}`);
  // });

  // db.on('close', (err) => {
  //   if (err) {
  //     logger.error(err, `Lost connection with mongodb: ${connectionString}`);
  //   } else {
  //     logger.warn(`Closed connection with mongodb: ${connectionString}`);
  //   }
  // });

  // db.on('connected', (err) => {
  //   if (err) {
  //     logger.error(err);
  //   } else {
  //     logger.info(`Connected to mongodb: ${connectionString}`);
  //   }
  // });

  db.setServiceMethod = (name, method) => {
    MongoService.prototype[name] = function customMethod(...args) {
      return method.apply(this, [this, ...args]);
    };
  };

  db.createQueryService = (collectionName, options = {}) => {
    // const collection = db.get(collectionName, { castIds: false });
    const collection = db.collection(collectionName);

    return new MongoQueryService(collection, options);
  };

  // db.setQueryServiceMethod = (name, method) => {
  //   MongoQueryService.prototype[name] = function customMethod(...args) {
  //     return method.apply(this, [this, ...args]);
  //   };
  // };

  return db;
};

module.exports.connect = connect;
// module.exports = {
//   connectDB(connectionString) {
//     return async (callback) => {
//       const db = await connect(connectionString);
//       return callback(db);
//     };
//   },
// };
