[![Build Status](https://travis-ci.com/LimeEng/HashingService.svg?branch=master)](https://travis-ci.com/LimeEng/HashingService)

# Hashing Service

This service provides an interface to hash arbitrary strings and files via a JSON API. These hashes can be used to verify the integrity of files or to protect passwords, if they are used correctly.

- [API](#api)

## API

- `GET /hash/algorithms`

  Returns a JSON array containing all available hashing algorithms.

  **Example successful response (200)**
  ```
  [ 'md5', 'sha1', 'sha256', 'sha512' ]
  ```

- `POST /hash`

  Hashes the specified content encoded in Base64 with the specified algorithms and returns the result. The returned hashes will also be encoded in Base64. If the algorithms or content is invalid a JSON object will be returned describing the error with a status of 404.

  **Example POST body**
  ```
  {
    "algorithms": [
      "md5",
      "sha256"
    ],
    "content": "Hello World!"
  }
  ```
  **Example successful response (200)**
  ```
  {
    "algorithms": [
      "md5",
      "sha256"
    ],
    "md5": {
      "hash": "ed076287532e86365e841e92bfc50d8c"
    },
    "sha256": {
      "hash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    }
  }
  ```
  **Example failed response (404)**
  ```
  {
    "error": "Malformed algorithms field"
  }
  ```
