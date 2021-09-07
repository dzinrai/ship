const tokenService = require('resources/token/token.service');
const cookieHelper = require('helpers/cookie.helper');

exports.setTokens = async (ctx, userId) => {
  const service = await tokenService;
  const res = await service.createAuthTokens({ userId });

  const options = {
    ctx,
    ...res,
  };

  cookieHelper.setTokenCookies(options);
};

exports.unsetTokens = async (ctx) => {
  const service = await tokenService;
  await service.removeAuthTokens(ctx.state.accessToken, ctx.state.refreshToken);
  cookieHelper.unsetTokenCookies(ctx);
};
