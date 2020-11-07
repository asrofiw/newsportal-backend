const {User} = require('../models')
const bcrypt = require('bcryptjs')
const joi = require('joi')

module.exports = {
  createUser: async (req, res) => {
    try {
      const shcema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
      })
  
      let {value, error} = shcema.validate(req.body)
      if (error) {
        res.status(400).send({
          success: false,
          message: 'All fields must be filled',
          error: error.message
        })
      }
  
      let {name, email, password} = value
      const isExist = await User.findOne({
        where: {email: email}
      })
  
      if (isExist !== null) {
        res.status(400).send({
          success: false,
          message: 'Email already used',
        })
      } else {
        password = await bcrypt.hash(password, await bcrypt.genSalt(10))
        const data = {
          name, email, password
        }
        const results = await User.create(data)
        res.send({
          success: true,
          message: `You've been successfully registered`,
          results
        })
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        message: 'Internal server error',
        error: e.message,
      })
    }
  },

  getUser: async (req, res) => {
    try {
      const results = await User.findAll({
        attributes: {exclude: ['password']}
      })
      res.send({
        success: true,
        message: 'List of Users',
        results
      })
    } catch (e) {
      res.status(500).send({
        success: false,
        message: 'Internal server error',
        error: e.message,
      })
    }
  },

  getUserDetail: async (req, res) => {
    try {
      const {id} = req.params
      const results = await User.findByPk(id)
      if (results !== null) {
        res.send({
          success: true,
          message: `User with id ${id}`,
          results
        })
      } else {
        res.status(404).send({
          success: false,
          message: 'User not found'
        })
      }
    } catch (e) {
      res.status(500).send({
        succes: false,
        message: 'Internal server error',
        error: e.message,
      })
    }
  },

  updateUser: async (req, res) => {
    try {
      const {id} = req.params
      const results = await User.findByPk(id)
      if (results !== null) {
        const schema = joi.object({
          name: joi.string(),
          email: joi.string(),
          dateofbirth: joi.string(),
          gender: joi.string(),
        })

        let {value, error} = schema.validate(req.body)

        if (error) {
          res.status(401).send({
            success: false,
            message: 'You have to fill at least one of them, if you want to change your data',
            error: error.message
          })
        } else {
          const {name, email, dateofbirth, gender} = value
          if (email) {
            const isExist = await User.findOne({
              where: {email: email}
            })
            if (isExist !== null) {
              res.status(400).send({
                success: false,
                message: 'Email already used',
              })
            }
          }
          const data = {
            name, email, dateofbirth, gender
          }
          results.update(data)
          res.send({
            success: true,
            message: 'Data has changed',
            data
          })
        }
      } else {
        res.status(404).send({
          success: false,
          message: 'User not found',
        })
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        message: 'Internal server error',
        error: e.message,
      })
    }
  }
}