const Router = require("koa-router");
const router = new Router();

let counter = 0;

const getCounter = () => {
    return counter++;
}
const stringToBoolean = (stringValue) => {
    switch(stringValue?.toLowerCase()?.trim()){
        case "true": 
        case "yes": 
        case "on":
        case "1": 
          return true;

        case "false": 
        case "no": 
        case "off":
        case "0": 
          return false;

        default: 
          return true;  // default to true
    }
}

console.log(`ENABLE_HELLO_ERROR - config ${process.env.ENABLE_HELLO_ERROR}`);

const enabled = stringToBoolean(process.env.ENABLE_HELLO_ERROR);
console.log(`ENABLE_HELLO_ERROR - eval ${enabled}`);

router.get("/api/hello", async (ctx) => {
    console.log("Hello 1 ... called " + new Date());
    ctx.body = 'Hello World \n';
    console.log("Hello ... done");

});

router.get("/api/hello/slow/:time/:id", async (ctx) => {
    const timestamp = new Date();
    const id = ctx.params.id;
    console.log(`Hello ${getCounter()} slow ${id} ... called at ${timestamp} ` );
    const time = parseInt(ctx.params.time) | 10;  // milliseconds
    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.body = `(${id}) Hello World ${time} at ${timestamp} \n`;
            console.log(`Hello slow ${id}  ... done`);
            resolve();
        }, time);
    })
});

router.get("/api/hello/error/:code/:id", async (ctx) => {
    const timestamp = new Date();
    const id = ctx.params.id;
    console.log(`Hello ${getCounter()} error ${id} ... called at ${timestamp} ` );
    const code = parseInt(ctx.params.code) | 500;  // error code 5xx, 4xx
   
    if(!enabled){
        ctx.status = 200;
        ctx.body = `(${id}) something good ${code} at ${timestamp} \n`;
        console.log(`Hello non-error ${id}  ... done`);
        return;
    }

    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.status = code;
            ctx.body = `(${id}) something wrong ${code} at ${timestamp} \n`;
            console.log(`Hello error ${id}  ... done`);
            resolve();
        }, 100);
    })
});

module.exports = router;
