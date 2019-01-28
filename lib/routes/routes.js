'use strict'

const Router = require('koa-router')
const hash = require('./hash-routes')

const router = new Router()

router.use('/hash', hash.routes(), hash.allowedMethods())

module.exports = router