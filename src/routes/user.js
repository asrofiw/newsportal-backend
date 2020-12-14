const user = require('../controllers/user')
const authMiddleware = require('../middleware/auth')

const route = require('express').Router()

// Route for admin
route.get('/users', user.getUser)

// Manage Profile
route.get('/private/users', authMiddleware, user.getUserDetail)
route.patch('/private/users', authMiddleware, user.updateUser)
route.delete('/private/users', authMiddleware, user.deleteUser)

module.exports = route
