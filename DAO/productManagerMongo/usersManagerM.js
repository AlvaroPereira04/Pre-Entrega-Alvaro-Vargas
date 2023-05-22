const { userModel } = require("../models/usersModel");

class UserManager {
    addUser = async (data) => {
        try {
            const findUser = await userModel.findOne({ email: data.email })

            if (findUser) {
                throw new Error('El usuario ya existe.')
            }

            return await userModel.create(data)
        } catch (error) {
            throw error
        }
    }

    loginUser = async (data) => {
        try {
            const { email, password } = data

            const findUser = await userModel.findOne({ email })
            if (!findUser) {
                throw new Error('El correo no se encuentra en la base de datos')
            }
            if (findUser.password !== password) {
                throw new Error('La contraseña es incorrecta')
            }

            return findUser
            /*             
            if (!limit) {
            return await userModel.find({}).limit(10).skip(page * 10).sort({ [query]: sort })
            } 
            */
        } catch (error) {
            throw error
        }
    }

    updateUser = async (changes, uid) => {
        try {
            console.log(uid, changes)
            return await userModel.updateOne({ _id: uid }, { $set: { changes } })
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = {
    UserManager
}