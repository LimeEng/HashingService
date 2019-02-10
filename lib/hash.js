'use strict'

const crypto = require('crypto')

function hash(algorithm, content, encoding, outputEncoding) {
  return crypto.createHash(algorithm).update(content, encoding).digest(outputEncoding)
}

module.exports = hash
