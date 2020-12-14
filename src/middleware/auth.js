const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const { APP_KEY } = process.env

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer ')) {
    let token = authorization.slice(7)
    try {
      token = jwt.verify(token, APP_KEY)
      if (token) {
        req.user = token
        next()
      } else {
        return response(res, 'Unauthorized', {}, 401, false)
      }
    } catch (err) {
      return response(res, 'Token error', { error: err.message }, 401, false)
    }
  } else {
    return response(res, 'Authorization needed', {}, 401, false)
  }
}
