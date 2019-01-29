'use strict'

const hash = require('../hash')

const validHashAlgos = Object.freeze(['md5', 'sha1', 'sha256', 'sha512'])
const encoding = 'base64'

function isValidHashAlgo(algo) {
  return validHashAlgos.includes(algo)
}

async function handle(request) {
  if (!isValidHashAlgo(request.algorithm)) {
    throw new Error('Invalid algorithm')
  }
  if (!request.content) {
    throw new Error('Invalid content')
  }
  const hashed = hash(request.algorithm, request.content, encoding, encoding)
  return {
    algorithm: request.algorithm,
    hash: hashed
  }
}

module.exports = {
  handle,
  validHashAlgos
}
