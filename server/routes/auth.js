const express = require('express')

const router = express.Router()

const {userSignUpValidator} = require('../validators/auth')
const {runValidation} = require('../validators')

const { register } = require('../controllers/auth')

router.post('/register_login', userSignUpValidator, runValidation, register)


module.exports = router;