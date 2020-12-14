const authMiddleware = require('../middleware/auth')
const news = require('../controllers/news')

const route = require('express').Router()

// Get news by user
route.get('/private/news/user', authMiddleware, news.getAllNewsByUser)

route.post('/private/news', authMiddleware, news.createNews)
route.get('/private/news', authMiddleware, news.getAllNews)
route.get('/private/news/:id', authMiddleware, news.getNewsDetail)
route.patch('/private/news/:id', authMiddleware, news.updateNews)
route.delete('/private/news/:id', authMiddleware, news.deleteNews)


module.exports = route