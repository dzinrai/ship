const _ = require('lodash');

const db = require('db');
const constants = require('app.constants');

const schema = require('./testReq.schema');

async function createService(dbInstance) {
  const newService = await dbInstance.createService(
    constants.DATABASE_DOCUMENTS.TESTENDPOINTS, { validate: schema },
  );

  newService.makeUniqueEmail = () => {
    return newService.atomic.createIndex({ email: 1 }, { unique: true });
  };

  newService.perform = (string) => {
    const transactions = async (session) => {
      const x = session.id.id;
      console.log('session OOO', x.buffer.toString('base64'));
      await newService.create({ email: string }, { session });

      // await service.create({ email: string }, { session });
    };
    return newService.performTransaction(transactions);
  };

  return newService;
}

const service = db(createService);

module.exports = service;
