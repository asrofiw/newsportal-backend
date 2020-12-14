const {User} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const joi = require('joi')
const response = require('../helpers/response')
const {APP_KEY} = process.env

module.exports = {
  registerUser: async (req, res) => {
    try {
      const shcema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
      })
  
      let {value, error} = shcema.validate(req.body)
      if (error) {
        return response(res, 'All field must be filled', {error: error.message}, 400, false)
      }
  
      let {name, email, password} = value
      const isExist = await User.findOne({
        where: {email: email}
      })
  
      if (isExist !== null) {
        return response(res, 'Email already used', {}, 400, false)
      } else {
        password = await bcrypt.hash(password, await bcrypt.genSalt(10))
        const data = {
          name, email, password
        }
        const results = await User.create(data)
        return response(res, `You've been successfully registered`, {results})
      }
    } catch (e) {
      return response(res, 'Internal server error', {error: e.message}, 500, false)
    }
  },

  loginUser: async (req, res) => {
    try {
      const schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
      })
      const {value, error} = schema.validate(req.body)
      if (error) {
        return response(res, 'Login failed', {error: error.message}, 400, false)
      }
      const {email, password} = value
      const checkEmail = await User.findOne({
        where: {email: email}
      })
      if (checkEmail) {
        const pass = bcrypt.compareSync(password, checkEmail.password)
        if (pass) {
          const token = jwt.sign({id: checkEmail.id}, APP_KEY, {expiresIn: '1d'})
          return response(res, 'Login successfully', {token: token})
        } else {
          return response(res, `Password doesn't match`, {}, 400, false)
        }
      } else {
        return response(res, 'Wrong email', {}, 400, false)
      }
    } catch (e) {
      return response(res, 'Internal server error', {error: e.message}, 500, false)
    }
  }
}