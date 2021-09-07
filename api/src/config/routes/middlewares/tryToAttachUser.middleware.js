const userService = require('resources/user/user.service');
const tokenService = require('resources/token/token.service');

const tryToAttachUser = async (ctx, next) => {
  let userData;

  if (ctx.state.accessToken) {
    const service = await tokenService;
    userData = await service.getUserDataByToken(ctx.state.accessToken);
  }

  if (userData) {
    const service = await userService;
    await service.updateLastRequest(userData.userId);
    ctx.state.user = await service.findOne({ _id: userData.userId });
    ctx.state.isShadow = userData.isShadow;
  }

  return next();
};

module.exports = tryToAttachUser;
