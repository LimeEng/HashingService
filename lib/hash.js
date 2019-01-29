'use strict'

const crypto = require('crypto')

function hash(algo, content, encoding, outputEncoding) {
  return crypto.createHash(algo).update(content, encoding).digest(outputEncoding)
}

module.exports = hash
