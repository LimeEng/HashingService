'use strict'

const crypto = require('crypto')

function md5(content) {
  return hash('md5', content)
}

function sha1(content) {
  return hash('sha1', content)
}

function sha256(content) {
  return hash('sha256', content)
}

function sha512(content) {
  return hash('sha512', content)
}

function hash(algo, content) {
  return crypto.createHash(algo).update(content).digest('base64')
}

module.exports = {
  md5,
  sha1,
  sha256,
  sha512
}
