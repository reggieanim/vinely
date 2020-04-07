const AWS = require('aws-sdk')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { registerEmailParams } = require('../helpers/email')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
})

//controller for auth related processes 
const ses = new AWS.SES({apiVersion: "2010-12-01"})

exports.register = (req, res) => {
   const {firstname, lastname, email, password} = req.body

   // user checking
   User.findOne({email}).exec((err, user) => {
    if(user) {
        return res.status(400).json({
            error: 'Email is taken'
        })
    }

    // generate token with user name email and password
    const token = jwt.sign({firstname, lastname, email, password}, process.env.JWT_ACCOUNT_ACTIVATION,{
        expiresIn: '10m'
    })
    
    // send link 
    const params = registerEmailParams(email, token)

    
    const sendEmailonRegister = ses.sendEmail(params).promise()

        sendEmailonRegister
        .then(data => {
            console.log('emal submitted to SES', data);
            res.json({message:`Email has been sent to ${email}, Follow the instructions to complete your registration`})
        })
        .catch(error => {
            console.log('ses email on register', error)
            res.json({
                error: `We could not verify your email, Please try again`
            })
        })
   })

  

}