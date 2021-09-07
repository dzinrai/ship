const Router = require('@koa/router');

const router = new Router();

require('./test').register(router);

module.exports = router.routes();
