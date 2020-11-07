const user = require('../controllers/user')
const upload = require('../helpers/upload')
const authMiddleware = require('../middleware/auth')

const route = require('express').Router()

// Route for admin
route.get('/users', user.getUser)

// Manage Profile
route.get('/private/users', authMiddleware, user.getUserDetail)
route.patch('/private/users', authMiddleware, upload.single('avatar'), user.updateUser)
route.delete('/private/users', authMiddleware, user.deleteUser)

module.exports = route