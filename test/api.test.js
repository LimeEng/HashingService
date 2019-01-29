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
      it('should return 404 with invalid algo', async function () {
        async function postWithAlgo(algo) {
          return axios.post('http://localhost:3000/hash', {
            algo: algo,
            content: utf8ToBase64('Hello World!')
          })
        }
        const results = ['', null, 'sha256652'].map(postWithAlgo)
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
            algo: 'md5',
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
