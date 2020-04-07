const mongoose = require('mongoose')
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            index: true,
            lowercase: true
        },
        lastname: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            index: true,
            lowercase: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique:true,
            lowercase: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        role: {
            type: String,
            default: 'user'
        },
        resetPasswordLink: {
            data: String, 
            default: ''
        }

    }, {timestamps:true})


 userSchema.virtual('password')
    .set(function(password){
        
        this._password = password

        this.salt = this.makeSalt()

        this.hashed_password = this.encryptPassword(password)

    })
    .get(function(){
        return this._password
    })

userSchema.methods = {
    encryptPassword: function(password) {
        if(!password) return ''

        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },

    authenthicate: function(plain) {
        return this.encryptPassword(plain) === this.hashed_password
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}

module.exports = mongoose.model('User', userSchema)