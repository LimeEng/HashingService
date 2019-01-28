'use strict'

const assert = require('assert').strict
const axios = require('axios').default

const server = require('../lib/server')

const hashes = require('./hash-testcases.json')

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
        for (const algo of hashes) {
          for (const testCase of algo.strings) {
            const result = await axios.post('http://localhost:3000/hash', {
              algo: algo.algo,
              content: utf8ToBase64(testCase.raw)
            })
            assert.deepStrictEqual(result.data.algo, algo.algo)
            assert.deepStrictEqual(base64ToHex(result.data.hash), testCase.hash, 'Hash for algo ' + algo.algo + ' does not match')
          }
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

function base64ToHex(content) {
  return Buffer.from(content, 'base64').toString('hex')
}
