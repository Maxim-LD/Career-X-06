

const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
    fullName: {type: String, require: true},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, require: true},
    age: {type: Number},
    phoneNumber: {type: Number},
    address: {type: String}
})

const Users = new mongoose.model("user", usersSchema)

module.exports = Users