[![Build Status](https://travis-ci.com/LimeEng/HashingService.svg?branch=master)](https://travis-ci.com/LimeEng/HashingService)

# Hashing Service

This service provides an online interface to hash arbitrary strings and files via a JSON API. These hashes can be used to verify the integrity of files or to protect passwords, if they are used correctly.

- [API](#api)

## API

- `GET /hash/algos`

  Returns a JSON array containing all available hashing algorithms.

  **Example successful response (200)**
  ```
  [ 'md5', 'sha1', 'sha256', 'sha512' ]
  ```

- `POST /hash`

  Hashes the specified content encoded in Base64 with the specified algorithm and returns the result. The returned hash will also be encoded in Base64. If the algorithm or content is invalid a JSON object will be returned describing the error with a status of 404.

  **Example POST body**
  ```
  {
  "algo": "sha256",
  "content": "SGVsbG8gV29ybGQh"
  }
  ```
  **Example successful response (200)**
  ```
  {
  "algo": "sha256",
  "hash": "f4OxZX/x/FO5LcGBSKHWXfwtSx+j1ncoSt3SABJtkGk="
  }
  ```
  **Example failed response (404)**
  ```
  {
  "error": "Invalid algorithm"
  }
  ```
