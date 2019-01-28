'use strict'

const crypto = require('crypto')

function hash(algo, content) {
  return crypto.createHash(algo).update(content).digest('base64')
}

module.exports = hash
