const { createHash, isValidPass } = require("../../utils/bcrypthash");
const { userModel } = require("../models/usersModel");

class UserManager {
    addUser = async (data) => {
        try {
            const { first_name, last_name, email, age, password } = data
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            const findUser = await userModel.findOne({ email })

            if (findUser) {
                throw new Error('El usuario ya existe.')
            }

            return await userModel.create(newUser)
        } catch (error) {
            if (error) {
                throw error
            }
        }
    }

    addUserGithub = async (data) => {
        try {
            const { name, email } = data

            const findUser = await userModel.findOne({ email })
            const newUser = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1],
                email,
                password: ""
            }
            if (findUser) {
                return newUser
            }
            await userModel.create(newUser)
            return newUser
        } catch (error) {
            if (error) throw error
        }
    }

    loginUser = async (data) => {
        try {
            const { email, password } = data

            const findUser = await userModel.findOne({ email })
            if (!findUser) throw new Error('No se encuentra el usuario')
            if (!isValidPass(password, findUser)) {
                throw new Error('El usuario o la contraseña con incorrectas')
            }
            /*
            if (!findUser) {
                throw new Error('El correo no se encuentra en la base de datos')
            }
            if (findUser.password !== password) {
                throw new Error('La contraseña es incorrecta')
            }
            */

            return findUser
            /*             
            if (!limit) {
            return await userModel.find({}).limit(10).skip(page * 10).sort({ [query]: sort })
            } 
            */
        } catch (error) {
            throw error.message
        }
    }

    changePassword = async (userReq) => {
        try {
            const { email, password } = userReq
            const newPass = createHash(password)
            const test = await userModel.findOneAndUpdate({ email }, { $set: { password: newPass } })
            return test
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    findUser = async (id) => {
        try {
            return await userModel.findById(id)
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = {
    UserManager
}