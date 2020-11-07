const {User} = require('../models')
const joi = require('joi')
const response = require('../helpers/response')

module.exports = {
  getUser: async (req, res) => {
    try {
      const results = await User.findAll({
        attributes: {exclude: ['password']}
      })
      return response(res, 'List of Users', {results})
    } catch (e) {
      return response(res, 'Internal server error', {error: e.message}, 500, false)
    }
  },

  getUserDetail: async (req, res) => {
    try {
      const {id} = req.user
      const results = await User.findByPk(id)
      if (results !== null) {
        return response(res, `User with id ${id}`, {results})
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', {error: e.message}, 500, false)
    }
  },

  updateUser: async (req, res) => {
    try {
      const {id} = req.user
      const results = await User.findByPk(id)
      if (results !== null) {
        const schema = joi.object({
          name: joi.string(),
          email: joi.string(),
          birthdate: joi.string(),
          gender: joi.string(),
        })

        let {value, error} = schema.validate(req.body)
        let avatar = ''
        if (req.file) {
          let { path } = req.file
          path = path.split('\\')
          path.shift()
          path = path.join('/')
          avatar = path
          value = {
            ...value,
            avatar
          }
        } else {
          avatar = undefined
        }

        if (error) {
          return response(res, 'Field must be filled', {error: error.message}, 400, false)
        } else {
          const {email} = value
          if (email) {
            const isExist = await User.findOne({
              where: {email: email}
            })
            if (isExist !== null) {
              return response(res, 'Email already use', {}, 400, false)
            }
          }

          if (Object.values(value).length > 0) {
            await results.update(value)
            return response(res, 'Data has been changed', {results: value})
          } else {
            return response(res, 'You have to fill at least one of them, if you want to change your data', {}, 400, false)
          }
        }
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', {error: e.message}, 500, false)
    }
  },

  deleteUser: async (req, res) => {
    try {
      const {id} = req.user
      const results = await User.findByPk(id)
      if (results !== null) {
        await results.destroy()
        return response(res, 'User has been deleted')
      } else {
        return response(res, 'User not found', {}, 404, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', {error: e.message}, 500, false)
    }
  }
}