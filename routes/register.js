const { json, send } = require('micro')

module.exports.POST = async function register (req, res) {
  const { db } = req
  try {
    let { username, email, password } = await json(req)
    const missing = []
    if (!username) missing.push('username')
    if (!email) missing.push('email')
    if (!password) missing.push('password')
    if (missing.length) return send(res, 400, { error: 'Bad Request', message: `Required fields missing: ${missing}` })
    username = username.toLowerCase()
    email = email.toLowerCase()
    const hash = await req.auth.hashPassword(password)
    const exists = await db.accounts.findOne({ $or:[{ username }, { email }] })
    if (exists) return send(res, 409, { error: 'User already exists', message: 'User already exists' })
    await db.accounts.insert({ username, email, password: hash })
    send(res, 200, { success: true })
  } catch(e) {
    send(res, 500, { error: 'Server Error', message: e.message || e })
  }
}
