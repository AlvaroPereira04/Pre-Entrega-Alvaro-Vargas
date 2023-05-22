const { Schema, model } = require('mongoose')

const collection = 'usuarios'

const usersSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        index: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: "undefined"
    },
    age: Number,
    password: String
})

const userModel = model(collection, usersSchema)

module.exports = {
    userModel
}