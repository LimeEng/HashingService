'use strict'

const Koa = require('koa');
const routes = require('./routes/routes')

const app = new Koa()

app.use(async (ctx, next) => {
  console.log('Route hit: ' + ctx.method + ' ' + ctx.originalUrl)
  await next()
})

app.use(routes.routes(), routes.allowedMethods())

module.exports = app
