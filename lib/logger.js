'use strict'

const logger = require('pino')()
const middlewareLogger = require('koa-pino-logger')()

module.exports = {
  logger,
  middlewareLogger
}