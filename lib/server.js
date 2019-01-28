'use strict'

const Koa = require('koa');
const routes = require('./routes/routes')

const app = new Koa()

app.use(routes.routes(), routes.allowedMethods())

module.exports = app
