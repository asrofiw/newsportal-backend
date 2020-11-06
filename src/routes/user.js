const user = require('../controllers/user')

const route = require('express').Router()

route.post('/auth/register', user.createUser)

module.exports = route