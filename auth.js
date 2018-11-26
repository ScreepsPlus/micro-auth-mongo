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
    const { iterations, keylen, digestAlgorithm } = this.options
    return crypto.pbkdf2Async(Buffer.from(password), salt, iterations, keylen, digestAlgorithm)
  }

  async hashPassword (password) {
    const { saltlen, encoding } = this.options
    const buf =  await crypto.randomBytesAsync(saltlen)
    const salt = buf.toString(encoding)
    const rawHash = await this.pbkdf2(password, salt)
    const hash = Buffer.from(rawHash, 'binary').toString(encoding)
    return `${salt}.${hash}`
  }

  async verifyPassword (pass, proposed) {
    const { encoding } = this.options
    const [salt, hash] = pass.split('.')
    const rawHash = await this.pbkdf2(proposed, salt)
    const calcedHash = Buffer.from(rawHash, 'binary').toString(encoding)
    return hash === calcedHash
  }
}
module.exports = Auth