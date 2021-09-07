const userService = require('resources/user/user.service');

async function handler(ctx) {
  const service = await userService;

  ctx.body = service.getPublic(ctx.state.user);
}

module.exports.register = (router) => {
  router.get('/current', handler);
};
