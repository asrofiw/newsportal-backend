const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const {APP_PORT} = process.env

// Import routes
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')

app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('dev'))
app.use(cors())

app.use('/', userRoute)
app.use('/', authRoute)

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Backend is running'
  })
})

app.listen(APP_PORT, () => {
  console.log(`App is listening on port ${APP_PORT}`)
})