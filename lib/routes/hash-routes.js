'use strict'

const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello, this is the API'
  await next()
})

module.exports = router
