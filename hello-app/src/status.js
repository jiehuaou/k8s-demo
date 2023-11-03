const Router = require("koa-router");
const router = new Router();

router.get("/ready", async (ctx) => {
   
    ctx.body = `I am ready to process requests`;

});

router.get("/healthy", async (ctx) => {
   
    ctx.body = `this app is healthy`;

});

module.exports = router;