require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')

//const send_otp_to_phone = require('./routes/sendOTP_to_phone')
//const send_otp_to_email = require('./routes/sendOTP_to_email')
//const verify_otp = require('./routes/verifyOTP')

const app = express()
const port = process.env.PORT || 4500

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const cors = require('cors')
const corsOption = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
}
app.use(cors(corsOption))

// To secure the Express app
app.use(helmet())
// Logger used by the middleware
app.use(logger('common'))

//Using imported Routes
//app.use('/api/v1/', send_otp_to_phone)
//app.use('/api/v1/', send_otp_to_email)
//app.use('/api/v1', verify_otp)

//==================================================================================================================================

// To check if server is running
app.get('/', function (req, res) {
  console.log('route / is accessed.')
  res.send('Hi')
})

//Listening on port 4500 or Port set in environment
app.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})