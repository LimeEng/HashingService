'use strict'

const hash = require('../hash')

const validHashAlgos = Object.freeze(['md5', 'sha1', 'sha256', 'sha512'])

function isValidHashAlgo(algo) {
  return validHashAlgos.includes(algo)
}

async function handle(request) {
  if (!isValidHashAlgo(request.algo)) {
    throw new Error('Invalid algorithm')
  }
  if (!request.content) {
    throw new Error('Invalid content')
  }
  const hashed = hash(request.algo, base64ToUtf8(request.content))
  return {
    algo: request.algo,
    hash: hashed
  }
}

function base64ToUtf8(content) {
  return Buffer.from(content, 'base64').toString('utf8')
}

module.exports = {
  handle,
  validHashAlgos
}
