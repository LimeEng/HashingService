'use strict'

const hash = require('../hash')

const validHashAlgos = Object.freeze(['md5', 'sha1', 'sha256', 'sha512'])
const encoding = 'base64'

function isValidHashAlgo(algo) {
  return validHashAlgos.includes(algo)
}

async function handle(request) {
  const algorithms = request.algorithms
  const content = request.content
  checkAlgorithmsField(algorithms)
  checkContentField(content)

  let hashed = {}
  hashed.algorithms = algorithms
  for (const algo of algorithms) {
    hashed[algo] = {
      hash: hash(algo, content, encoding, encoding)
    }
  }
  return hashed
}

function checkAlgorithmsField(field) {
  if (!Array.isArray(field)) {
    throw new Error('Malformed algorithms field')
  }
  if (field.length > validHashAlgos.length) {
    throw new Error('Malformed algorithms field')
  }
  if (containsDuplicates(field)) {
    throw new Error('Duplicates found among the specified algorithms')
  }
  const invalid = field.filter(algo => !isValidHashAlgo(algo))
  if (invalid.length) {
    throw new Error('Invalid algorithms detected: ' + invalid)
  }
}

function checkContentField(field) {
  if (!field) {
    throw new Error('Invalid content')
  }
}

function containsDuplicates(array) {
  return (new Set(array)).size !== array.length
}

module.exports = {
  handle,
  validHashAlgos
}
