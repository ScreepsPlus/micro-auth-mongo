const basicAuth = require('basic-auth')
const { send } = require('micro')

module.exports = async function checkAuth (req, res) {
  const { db, auth } = req
  const { name, pass } = basicAuth(req) || {}
  if (!name || !pass) return unauth(res)
  const { password, salt, hash } = await db.accounts.findOne({ username: name }) || {}
  if (!password && (!salt || !hash)) return unauth(res)
  const valid = await auth.verifyPassword(password || `${salt}.${hash}`, pass)
  if (valid) {
    return { success: true }
  } else {
    return unauth(res)
  }
}

function unauth(res) {
  return send(res, 401, { error: 'Unauthorized', message: 'Invalid username or password' })
}