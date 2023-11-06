const Router = require("koa-router");
const router = new Router();

const POD_NAME = process.env.HOSTNAME || 'unknown';
let _counter = 1;

const getCounter = () => {
    return _counter++;
}

const getLabel = () => {
    return `${getCounter()}/${POD_NAME}`;
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

console.log(`HOSTNAME - config is ${process.env.HOSTNAME}`);

console.log(`ENABLE_HELLO_ERROR - config is ${process.env.ENABLE_HELLO_ERROR}`);

const enabled = stringToBoolean(process.env.ENABLE_HELLO_ERROR);
console.log(`ENABLE_HELLO_ERROR - eval => ${enabled}`);

router.get("/api/hello", async (ctx) => {
    console.log("Hello 1 ... called " + new Date());
    ctx.body = 'Hello World \n';
    console.log("Hello ... done");

});

router.get("/api/hello/slow/:time/:id", async (ctx) => {
    const timestamp = new Date();
    const id = ctx.params.id;
    const label = getLabel();
    console.log(`Hello ${label} slow-ID ${id} ... at ${timestamp} ` );
    const time = parseInt(ctx.params.time) | 10;  // milliseconds
    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.body = ` ${label} (${id}) Hello World ${time} at ${timestamp} \n`;
            console.log(`Hello ${label} slow-ID ${id}  ... done`);
            resolve();
        }, time);
    })
});

router.get("/api/hello/error/:code/:id", async (ctx) => {
    const timestamp = new Date();
    const id = ctx.params.id;
    const label = getLabel();
    console.log(`Hello ${label} error-ID ${id} ... at ${timestamp} ` );
    const code = parseInt(ctx.params.code) | 500;  // error code 5xx, 4xx
   
    if(!enabled){
        ctx.status = 200;
        ctx.body = `${label}(${id}) good-code ${code} at ${timestamp} \n`;
        console.log(`${label}(${id}) good ${code}  ... done`);
        return;
    }

    await new Promise((resolve) => {
        setTimeout(() => {
            ctx.status = code;
            ctx.body = `${label}(${id}) wrong-code ${code} at ${timestamp} \n`;
            console.log(`${label}(${id}) wrong ${code}  ... done`);
            resolve();
        }, 100);
    })
});

module.exports = router;
