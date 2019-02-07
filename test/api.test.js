'use strict'

const assert = require('assert').strict
const axios = require('axios').default

const server = require('../lib/server')

const hashes = require('./hash-testcases.json')

const validHashAlgos = hashes.algorithms

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
        for (const algo of validHashAlgos) {
          for (const hash of hashes.hashed) {
            const result = await axios.post('http://localhost:3000/hash', {
              algorithms: [
                algo
              ],
              content: utf8ToBase64(hash.plain)
            })
            assert.deepStrictEqual(result.data.algorithms, [algo])
            assert.deepStrictEqual(base64ToHex(result.data[algo].hash), testCase[algo], 'Hash for algo ' + algo + ' does not match')
          }
        }
      })
      it('should return correct hashes for multiple algorithms', async function () {
        const testCase = hashes.hashed[0]
        const result = await axios.post('http://localhost:3000/hash', {
          algorithms: validHashAlgos,
          content: utf8ToBase64(testCase.plain)
        })
        const data = result.data
        assert.deepStrictEqual(data.algorithms, validHashAlgos)
        for (const algo of validHashAlgos) {
          assert.deepStrictEqual(data[algo].hash, testCase[algo])
        }
      })
      it('should return 404 if the algorithms field is malformed', async function () {
        async function postWithAlgo(algorithms) {
          return axios.post('http://localhost:3000/hash', {
            algorithms: algorithms,
            content: utf8ToBase64('Hello World!')
          })
        }
        const results = ['', null, 'sha256652', 'sha256', ['sha256', 'sha256652'], ['sha256', 'md5', 'sha256']].map(postWithAlgo)
        const promises = results.map(result => {
          return result.then(res => {
            assert(false)
          }).catch(err => {
            assert.deepStrictEqual(err.response.status, 404)
            assert(err.response.data.error) // Should contain data
          })
        })
        return Promise.all(promises)
      })
      it('should return 404 with invalid content', async function () {
        async function postWithContent(content) {
          return axios.post('http://localhost:3000/hash', {
            algorithms: [
              "md5"
            ],
            content: content
          })
        }
        const results = ['', null].map(postWithContent)
        const promises = results.map(result => {
          return result.then(res => {
            assert(false)
          }).catch(err => {
            if (err.response) {
              assert.deepStrictEqual(err.response.status, 404)
              assert(err.response.data.error) // Should contain data
            } else {
              assert(false)
            }
          })
        })
        return Promise.all(promises)
      })
    })
  })

  describe('GET', function () {
    describe('/hash', function () {
      describe('/algorithms', function () {
        it('should return 200', async function () {
          const result = await axios.get('http://localhost:3000/hash/algorithms')
          assert(result.status === 200)
        })
        it('should return the correct algorithms', async function () {
          const result = await axios.get('http://localhost:3000/hash/algorithms')
          assert.deepStrictEqual(result.data, validHashAlgos)
        })
      })
    })
  })
})

function utf8ToBase64(content) {
  return convert('utf8').to('base64').with(content)
}

function base64ToHex(content) {
  return convert('base64').to('hex').with(content)
}

function convert(encoding) {
  return {
    to: output => {
      return {
        with: content => {
          return Buffer.from(content, encoding).toString(output)
        }
      }
    }
  }
}
