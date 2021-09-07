const config = require('config');
const userService = require('resources/user/user.service');
const googleService = require('services/google.service.js');
const authService = require('services/auth.service');

const createUserAccount = async (userData) => {
  const service = await userService;

  const user = await service.create({
    firstName: userData.given_name,
    lastName: userData.family_name,
    email: userData.email,
    isEmailVerified: true,
    oauth: {
      google: true,
    },
  });

  return user;
};

const getOAuthUrl = async (ctx) => {
  ctx.redirect(googleService.oAuthURL);
};

const ensureAccountCreated = async (payload) => {
  const service = await userService;
  const user = await service.findOne({ email: payload.email });

  if (user) {
    if (!user.oauth.google) {
      const userChanged = await service.updateOne(
        { _id: user._id },
        (old) => ({ ...old, oauth: { google: true } }),
      );

      return userChanged;
    }

    return user;
  }

  return createUserAccount(payload);
};

const signinGoogleWithCode = async (ctx) => {
  const { code } = ctx.request.query;
  const service = await userService;
  const { isValid, payload } = await googleService.exchangeCodeForToken(code);

  ctx.assert(isValid, 404);

  const { _id: userId } = await ensureAccountCreated(payload);

  await Promise.all([
    service.updateLastRequest(userId),
    authService.setTokens(ctx, userId),
  ]);
  ctx.redirect(config.webUrl);
};

module.exports.register = (router) => {
  router.get('/signin/google/auth', getOAuthUrl);
  router.get('/signin/google', signinGoogleWithCode);
};
