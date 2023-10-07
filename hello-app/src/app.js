const Koa = require('koa');
const Router = require("koa-router");
const hello = require('./hello');
const check = require('./check');
const app = new Koa();
const port = 3000;

const home = new Router();
home.get('/', ctx => {
  const line1 = `curl 127.0.0.1:3000/api/hello`;
  const line2 = `curl 127.0.0.1:3000/api/hello/slow/:msecond/:id`;
  const line3 = `curl 127.0.0.1:3000/api/hello/error/:code/:id`;
  ctx.body = `${line1} \n${line2} \n${line3}`;
})

app.use(hello.routes());
app.use(check.routes());
app.use(home.routes());

app.listen(port, () => {
  console.log(`Koa.js server listening at http://localhost:${port}`);
});