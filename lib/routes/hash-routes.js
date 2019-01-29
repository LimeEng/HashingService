'use strict'

const Router = require('koa-router')
const hash = require('../controllers/hash-controller')
const router = new Router()

router.get('/algorithms', async (ctx, next) => {
  ctx.status = 200
  ctx.body = hash.validHashAlgos
})

router.post('/', async (ctx, next) => {
  const json = ctx.request.body
  try {
    const result = await hash.handle(json)
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    ctx.status = 404
    ctx.body = {
      error: err.message
    }
  }
})

module.exports = router
