const Router = require("koa-router");
const router = new Router();

router.get("/check", async (ctx) => {
    console.log("check ... called");

    ctx.body = `check without other \n`;

});

router.get("/check/:p1", async (ctx) => {
    console.log("check ... called");

    ctx.body = `check1 / ${ctx.params.p1} \n`;

});

router.get("/check/:p1/:p2", async (ctx) => {
    console.log("check ... called");

    ctx.body = `check2 / ${ctx.params.p1} / ${ctx.params.p2} \n`;

});

router.get("/check/:p1/:p2/:p3", async (ctx) => {
    console.log("check ... called");

    ctx.body = `check3 / ${ctx.params.p1} / ${ctx.params.p2} / ${ctx.params.p3} \n`;

});

module.exports = router;
