const { send } = require('micro')
const path = require('path')
const match = require('fs-router')(path.join(__dirname, '/routes'))

const db = require('./db.js')
const Auth = require('./auth.js')

async function setup (fn) {
  return async (req, res) => {
    req.db = {
      accounts: await db.get('accounts')
    }
    req.auth = new Auth()
    return fn(req, res)
  }
}

module.exports = setup(async (req, res) => {
  const matched = match(req)
  if (matched) return matched(req, res)
  send(res, 404, { error: 'Not found' })
})
