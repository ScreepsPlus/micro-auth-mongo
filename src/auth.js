const crypto = require('crypto')
const Promise = require('bluebird')

Promise.promisifyAll(crypto)

const DEFAULTS = {
  saltlen: 32,
  iterations: 25000,
  keylen: 512,
  encoding: 'hex',
  digestAlgorithm: 'sha256' // To get a list of supported hashes use crypto.getHashes()
}
class Auth {
  constructor (opts = {}) {
    this.opts = opts
    this.options = Object.assign({}, DEFAULTS, opts.auth || opts)
  }

  pbkdf2 (password, salt) {
    let { iterations, keylen, digestAlgorithm } = this.options
    return crypto.pbkdf2Async(Buffer.from(password), salt, iterations, keylen, digestAlgorithm)
  }

  async hashPassword (password) {
    let { saltlen, encoding } = this.options
    let buf =  await crypto.randomBytesAsync(saltlen)
    let salt = buf.toString(encoding)
    let rawHash = await this.pbkdf2(password, salt)
    let hash = Buffer.from(rawhash, 'binary').toString(encoding)
    return `${salt}.${hash}`
  }

  async verifyPassword (pass, proposed) {
    let { encoding } = this.options
    let [salt, hash] = pass.split('.')
    let rawHash = await this.pbkdf2(proposed, salt)
    let calcedHash = Buffer.from(rawhash, 'binary').toString(encoding)
    return hash === calcedHash
  }
}
module.exports = Auth