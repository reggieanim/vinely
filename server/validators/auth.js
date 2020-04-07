const { check } = require('express-validator')

exports.userSignUpValidator = [
    check("firstname", "First name is required").notEmpty(),
    check("lastname", "Last name is required").notEmpty(),

    check("email")
      .isEmail()
      .withMessage("Must be a valid email"),
  
    check("password", "Password is required")
     .isLength({min:6})
    .withMessage("Password must contain at least 6 characters")
    
    
]