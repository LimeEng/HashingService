'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const hash = require('./hash-routes')

const router = new Router()

router.use(bodyParser({
  enableTypes: ['json'],
  jsonLimit: '100mb',
  encoding: 'utf8'
}))

router.use('/hash', hash.routes(), hash.allowedMethods())

module.exports = router
