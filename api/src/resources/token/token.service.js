const db = require('db');
const securityUtil = require('security.util');
const { DATABASE_DOCUMENTS, TOKEN_SECURITY_LENGTH, TOKEN_TYPES } = require('app.constants');

const validateSchema = require('./token.schema');

async function createService(dbInstance) {
  const newService = await dbInstance.createService(
    DATABASE_DOCUMENTS.TOKENS, { validate: validateSchema },
  );
  const createToken = async (userId, type) => {
    const value = await securityUtil.generateSecureToken(TOKEN_SECURITY_LENGTH);

    return newService.create({
      type, value, userId, isShadow: false,
    });
  };

  newService.createAuthTokens = async ({ userId }) => {
    const accessTokenEntity = await createToken(userId, TOKEN_TYPES.ACCESS);

    return {
      accessToken: accessTokenEntity.value,
    };
  };
  newService.getUserDataByToken = async (token) => {
    const tokenEntity = await newService.findOne({ value: token });

    return tokenEntity && {
      userId: tokenEntity.userId,
      isShadow: tokenEntity.isShadow,
    };
  };
  newService.removeAuthTokens = async (accessToken) => {
    return newService.remove({ value: { $in: [accessToken] } });
  };

  return newService;
}

const service = db(createService);
console.log('--------------------------------------------');
console.log('--------------------------------------------');
console.log('--------------------------------------------');
console.log('service', service);
console.log('--------------------------------------------');
console.log('--------------------------------------------');
console.log('--------------------------------------------');

module.exports = service;
