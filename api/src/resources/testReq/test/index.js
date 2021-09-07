const Joi = require('joi');
const validate = require('middlewares/validate');
const testReqService = require('resources/testReq/testReq.service');

const schema = Joi.object({
  email: Joi.string()
    .messages({
      'string.empty': 'Email is required',
    }),
});

async function handler(ctx) {
  const { email } = ctx.validatedData;

  // await testReqService.makeUniqueEmail();
  const service = await testReqService;
  await service.perform(email);
  ctx.body = {};
}

module.exports.register = (router) => {
  router.post('/test', validate(schema), handler);
};
