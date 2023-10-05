const Router = require("koa-router");
const router = new Router();


router.get("/hello", async (ctx) => {
    console.log("Hello ... called");
    ctx.body = 'Hello World \n';
    console.log("Hello ... done");

});

router.get("/hello-slow/:time", async (ctx) => {
    console.log("Hello ... called");
    const time = parseInt(ctx.params.time);  // milliseconds
    await new Promise((resolve) => {
        setTimeout(() => {
            const timestamp = new Date();
            ctx.body = `Hello World ${time} at ${timestamp} \n`;
            console.log("Hello ... done");
            resolve();
        }, time);
    })
});

router.get("/hello-error/:code", async (ctx) => {
    console.log("Hello ... called");
    const code = parseInt(ctx.params.code);  // milliseconds
    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.status = code;
            const timestamp = new Date();
            ctx.body = `something wrong ${code} at ${timestamp} \n`;
            console.log("Hello ... done");
            resolve();
        }, 500);
    })
});

module.exports = router;
