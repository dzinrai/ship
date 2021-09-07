const _ = require('lodash');

const db = require('db');
const constants = require('app.constants');

const validateSchema = require('./user.schema');

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

async function createService(dbInstance) {
  const newService = await dbInstance.createService(
    constants.DATABASE_DOCUMENTS.USERS, { validate: validateSchema },
  );

  newService.updateLastRequest = async (_id) => {
    return newService.atomic.update({ _id }, {
      $set: {
        lastRequest: new Date(),
        updatedOn: new Date(),
      },
    });
  };

  newService.getPublic = (user) => {
    return _.omit(user, privateFields);
  };

  return newService;
}

const service = db(createService);

module.exports = service;
