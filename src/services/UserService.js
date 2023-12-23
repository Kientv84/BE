const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { generalRefreshToken, generalAccessToken } = require('./JwtService')

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already have'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password,)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or email is incorrect'
                })
            }

            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (error) {
            console.error('Error generating tokens:', error);
            reject({
                status: 'ERR',
                message: 'Token generation failed'
            });
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById({
                _id: id
            })
            // console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            // console.log('updateUser', updateUser)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser
            })
        } catch (error) {
            console.error('Error generating tokens:', error);
            reject({
                status: 'ERR',
                message: 'Token generation failed'
            });
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user SUCCESS',
            })
        } catch (error) {
            console.error('Error generating tokens:', error);
            reject({
                status: 'ERR',
                message: 'Token generation failed'
            });
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allUser = await User.find().select('_id name email phone address isAdmin')
            resolve({
                status: 'OK',
                message: 'Get all use SUCCESS',
                data: allUser
            })
        } catch (error) {
            console.error('Error generating tokens:', error);
            reject({
                status: 'ERR',
                message: 'Token generation failed'
            });
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Get user details SUCCESS',
                data: user
            })
        } catch (error) {
            console.error('Error generating tokens:', error);
            reject({
                status: 'ERR',
                message: 'Token generation failed'
            });
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}