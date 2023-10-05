const Router = require("koa-router");
const router = new Router();


router.get("/api/hello", async (ctx) => {
    console.log("Hello 1 ... called " + new Date());
    ctx.body = 'Hello World \n';
    console.log("Hello ... done");

});

router.get("/api/hello/slow/:time/:id", async (ctx) => {
    const timestamp = new Date();
    const id = ctx.params.id;
    console.log(`Hello slow ${id} ... called at ${timestamp} ` );
    const time = parseInt(ctx.params.time);  // milliseconds
    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.body = `Hello World ${time} at ${timestamp} \n`;
            console.log(`Hello slow ${id}  ... done`);
            resolve();
        }, time);
    })
});

router.get("/api/hello/error/:code/:id", async (ctx) => {
    const timestamp = new Date();
    const id = ctx.params.id;
    console.log(`Hello error ${id} ... called at ${timestamp} ` );
    const code = parseInt(ctx.params.code);  // error code 5xx, 4xx
    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.status = code;
            
            ctx.body = `something wrong ${code} at ${timestamp} \n`;
            console.log(`Hello error ${id}  ... done`);
            resolve();
        }, 500);
    })
});

module.exports = router;
