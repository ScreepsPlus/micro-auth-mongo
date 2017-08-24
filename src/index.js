const http = require('http')
const basicAuth = require('basic-auth')
const Auth = require('./auth.js')
const db = require('./db.js')
const auth = new Auth()

let server = http.createServer((req, res) => {
  this.checkAuth(req, res).then(valid => {
    res.statusCode = valid ? 200 : 401
    res.end()
  })
})

server.listen(process.env.PORT || 8080)

async function checkAuth (req, res) {
  let { name, pass } = basicAuth(req) || {}
  if (!name || !pass) return false
  let { password } = await db.get('account').findOne({ username: name })
  if (!password) return false
  return auth.verifyPassword(password, pass)
}