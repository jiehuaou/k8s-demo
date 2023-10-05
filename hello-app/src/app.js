const Koa = require('koa');
const hello = require('./hello');
const app = new Koa();
const port = 3000;

app.use(hello.routes());

app.listen(port, () => {
  console.log(`Koa.js server listening at http://localhost:${port}`);
});