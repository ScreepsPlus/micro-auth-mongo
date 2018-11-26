const basicAuth = require('basic-auth')
const { send } = require('micro')

module.exports = async function checkAuth (req, res) {
  const { db, auth } = req
  const { name, pass } = basicAuth(req) || {}
  if (!name || !pass) return unauth(res)
  const { password } = await db.account.findOne({ username: name }) || {}
  if (!password) return unauth(res)
  const valid = await auth.verifyPassword(password, pass)
  if (valid) {
    return { success: true }
  } else {
    return unauth(res)
  }
}

function unauth(res) {
  return send(res, 401, { error: 'Unauthorized', message: 'Invalid username or password' })
}