

const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
    firstName: {type: String, require: true},
    lastName: {type: String},
    email: {type: String, require: true},
    age: {type: Number},
    phoneNumber: {type: Number},
    address: {type: String},

    walletBalance: {type: Number, default: 0}
})

const Users = new mongoose.model("user", usersSchema)

module.exports = Users