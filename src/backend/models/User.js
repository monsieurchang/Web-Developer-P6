let mongoose = require('mongoose')
let uniqueValidator = require('mongoose-unique-validator')

let userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)