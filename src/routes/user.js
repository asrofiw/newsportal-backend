const user = require('../controllers/user')

const route = require('express').Router()

route.post('/auth/register', user.createUser)
route.get('/users', user.getUser)
route.get('/users/:id', user.getUserDetail)
route.patch('/users/:id', user.updateUser)

module.exports = route