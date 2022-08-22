const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
const bcrypt = require('bcrypt')

app.set('view engine', 'pug')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', (req, res, next) => {
  res.status(200).render('register')
})

router.post('/', async (req, res, next) => {
  var firstName = req.body.firstName.trim()
  var lastName = req.body.lastName.trim()
  var username = req.body.username.trim()
  var email = req.body.email.trim()
  var password = req.body.password

  var payload = req.body

  if (firstName && lastName && username && email && password) {
    var user = await User.findOne({
      $or: [{ username }, { email }],
    }).catch((err) => {
      console.log(err)
      payload.errorMessage = 'Something Went Wrong!'
      return res.status(200).render('register', payload)
    })

    if (user == null) {
      var data = req.body
      data.password = await bcrypt.hash(password, 10)
      User.create(data).then((user) => {
        req.session.user = user
        return res.redirect('/')
      })
    } else {
      if (user.email == email) {
        payload.errorMessage = 'Email already Exists'
      } else {
        payload.errorMessage = 'Username already Exists'
      }
      return res.status(200).render('register', payload)
    }
  } else {
    payload.errorMessage = 'Make sure each field has valid value.'
    res.status(200).render('register', payload)
  }
})

module.exports = router