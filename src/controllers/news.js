const { User, News } = require('../models')
const qs = require('querystring')
const joi = require('joi')
const { Op } = require('sequelize')
const response = require('../helpers/response')
const upload = require('../helpers/upload').single('image')
const multer = require('multer')
const { APP_URL } = process.env

module.exports = {
  createNews: (req, res) => {
    upload(req, res, async err => {
      if (err instanceof multer.MulterError) {
        return response(res, err.message, {}, 400, false)
      } else if (err) {
        return response(res, err.message, {}, 400, false)
      }
      try {
        const { id } = req.user
        const schema = joi.object({
          headline: joi.string().required(),
          city: joi.string().required(),
          body: joi.string().required(),
          category: joi.string().required()
        })

        let { value, error } = schema.validate(req.body)
        let image = ''
        if (req.file) {
          const { filename } = req.file
          image = `uploads/${filename}`
          value = {
            ...value,
            image
          }
        } else {
          image = undefined
        }

        if (error) {
          return response(res, 'Error', { error: error.message }, 400, false)
        }
        const findAuthor = await User.findByPk(id)
        value = {
          ...value,
          author: findAuthor.name,
          authorId: id
        }

        const results = await News.create(value)
        if (results) {
          return response(res, 'Successfully added news', { results })
        } else {
          return response(res, 'Failed to add news', {}, 400, false)
        }
      } catch (e) {
        return response(res, 'Internal server error', { error: e.message }, 500, false)
      }
    })
  },

  getAllNews: async (req, res) => {
    try {
      let { page, limit, search, sort } = req.query
      if (!page) {
        page = 1
      } else {
        page = parseInt(page)
      }
      if (!limit) {
        limit = 5
      } else {
        limit = parseInt(limit)
      }

      if (!search) {
        search = ''
      }

      if (!sort) {
        sort = 'desc'
      }

      const { count, rows } = await News.findAndCountAll({
        where: {
          headline: {
            [Op.substring]: search
          }
        },
        order: [
          ['createdAt', sort]
        ],
        limit: limit,
        offset: (page - 1) * limit
      })

      if (rows.length > 0) {
        const pageInfo = {
          count: 0,
          pages: 0,
          currentPage: page,
          limitPerpage: limit,
          nextLink: null,
          prevLink: null
        }
        pageInfo.count = count
        pageInfo.pages = Math.ceil(count / limit)
        const { pages, currentPage } = pageInfo

        if (currentPage < pages) {
          pageInfo.nextLink = `${APP_URL}private/news?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
        }

        if (currentPage > 1) {
          pageInfo.prevLink = `${APP_URL}private/news?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
        }

        return response(res, 'List of News', { results: rows, pageInfo })
      } else {
        return response(res, 'Data not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', { error: e.message }, 500, false)
    }
  },

  getAllNewsByUser: async (req, res) => {
    try {
      let { page, limit } = req.query
      if (!page) {
        page = 1
      } else {
        page = parseInt(page)
      }
      if (!limit) {
        limit = 5
      } else {
        limit = parseInt(limit)
      }

      const { id } = req.user
      const { count, rows } = await News.findAndCountAll({
        where: { authorId: id },
        order: [
          ['createdAt', 'desc']
        ],
        limit: limit,
        offset: (page - 1) * limit
      })

      if (rows.length > 1) {
        const pageInfo = {
          count: 0,
          pages: 0,
          currentPage: page,
          limitPerpage: limit,
          nextLink: null,
          prevLink: null
        }
        pageInfo.count = count
        pageInfo.pages = Math.ceil(count / limit)
        const { pages, currentPage } = pageInfo

        if (currentPage < pages) {
          pageInfo.nextLink = `${APP_URL}private/news/user?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
        }

        if (currentPage > 1) {
          pageInfo.prevLink = `${APP_URL}private/news/user?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
        }
        return response(res, 'List of News', { results: rows, pageInfo })
      } else {
        return response(res, 'Data not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', { error: e.message }, 500, false)
    }
  },

  getNewsDetail: async (req, res) => {
    try {
      const { id } = req.params
      const results = await News.findByPk(id)
      if (results) {
        return response(res, `News with headline "${results.headline}"`, { results })
      } else {
        return response(res, 'Data not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', { error: e.message }, 500, false)
    }
  },

  updateNews: (req, res) => {
    upload(req, res, async err => {
      if (err instanceof multer.MulterError) {
        return response(res, err.message, {}, 400, false)
      } else if (err) {
        return response(res, err.message, {}, 400, false)
      }

      try {
        const { id } = req.user
        const { idNews } = req.params
        const results = await News.findOne({ where: { id: idNews, authorId: id } })
        if (results) {
          const schema = joi.object({
            headline: joi.string(),
            city: joi.string(),
            body: joi.string(),
            category: joi.string()
          })

          let { value, error } = schema.validate(req.body)
          let image = ''
          if (req.file) {
            const { filename } = req.file
            image = `uploads/${filename}`
            value = {
              ...value,
              image
            }
          } else {
            image = undefined
          }

          if (error) {
            return response(res, 'Field must be filled', { error: error.message }, 400, false)
          } else {
            if (Object.values(value).length > 0) {
              await results.update(value)
              return response(res, 'Data has been changed', { results: value })
            } else {
              return response(res, 'You have to fill at least one of them, if you want to change your data', {}, 400, false)
            }
          }
        } else {
          return response(res, 'Data not found!', {}, 404, false)
        }
      } catch (e) {
        return response(res, 'Internal server error', { error: e.message }, 500, false)
      }
    })
  },

  deleteNews: async (req, res) => {
    try {
      const { id } = req.user
      const { idNews } = req.params
      const results = await News.findOne({ where: { id: idNews, authorId: id } })
      if (results !== null) {
        await results.destroy()
        return response(res, 'Data has been deleted')
      } else {
        return response(res, 'Data not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', { error: e.message }, 500, false)
    }
  }
}
