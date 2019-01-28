'use strict'

const assert = require('assert').strict
const axios = require('axios').default

const server = require('../lib/server')

const hashes = [
  {
    algo: 'md5',
    rawString: 'Hello World!',
    hash: 'ed076287532e86365e841e92bfc50d8c'
  },
  {
    algo: 'sha1',
    rawString: 'Hello World!',
    hash: '2ef7bde608ce5404e97d5f042f95f89f1c232871'
  },
  {
    algo: 'sha256',
    rawString: 'Hello World!',
    hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    algo: 'sha512',
    rawString: 'Hello World!',
    hash: '861844d6704e8573fec34d967e20bcfef3d424cf48be04e6dc08f2bd58c729743371015ead891cc3cf1c9d34b49264b510751b1ff9e537937bc46b5d6ff4ecc8'
  }
]

const validHashAlgos = hashes.map(item => item.algo)

describe('API', function () {
  let runningServer = undefined

  before(function () {
    runningServer = server.listen(3000)
  });

  after(function () {
    runningServer.close()
  })

  describe('POST', function () {
    describe('/hash', function () {
      it('should return correct hashes for all valid algos', async function () {
        for (const hash of hashes) {
          const result = await axios.post('http://localhost:3000/hash', {
            algo: hash.algo,
            content: utf8ToBase64(hash.rawString)
          })
          assert.deepStrictEqual(result.data.algo, hash.algo)
          assert.deepStrictEqual(base64ToUtf8(result.data.hash), hash.hash, 'Hash for algo ' + hash.algo + ' does not match')
        }
      })
    })
  })

  describe('GET', function () {
    describe('/hash', function () {
      describe('/algos', function () {
        it('should return 200', async function () {
          const result = await axios.get('http://localhost:3000/hash/algos')
          assert(result.status === 200)
        })
        it('should return the correct algos', async function () {
          const result = await axios.get('http://localhost:3000/hash/algos')
          assert.deepStrictEqual(result.data, validHashAlgos)
        })
      })
    })
  })
})

function utf8ToBase64(content) {
  return Buffer.from(content, 'utf8').toString('base64')
}

function base64ToUtf8(content) {
  return Buffer.from(content, 'base64').toString('hex')
}
