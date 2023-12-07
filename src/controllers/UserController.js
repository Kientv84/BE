const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config
// const imageType = require('image-type');

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is not format of an email!'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password and confirm password is not the same'
            })
        } else if (password?.length < 8) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Password should be at least 8 characters long'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is not format of an email!'
            })
        }
        const response = await UserService.loginUser(req.body)
        // console.log('re', response)
        const { refresh_token, ...newReponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
            // //     path: '/',
        })
        return res.status(200).json({ ...newReponse })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        // const avatar = req.body.avatar
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is not exist'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is not exist'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is not exist'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    // console.log('req.cookies.refresh_token', req.cookies.refresh_token)
    try {
        const token = req.cookies.refresh_token
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isEmailValid = emailRegex.test(email);
    if (!email) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The input is required'
        })
    } else if (!isEmailValid) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The input is not in the format of an email!'
        });
    }
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The email does not exist'
            });
        }

        const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_ACCOUNT,
                pass: process.env.MAIL_PASSWORD
            }
        });

        var mailOptions = {
            from: process.env.MAIL_ACCOUNT,
            to: user?.email,
            subject: 'Reset Password Link',
            text: `Verify to Reset Password: http://localhost:3000/reset-password/${user._id}/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log(error);
                return res.status(404).json({ status: 'ERR', message: 'Failed to send email' });
            } else {
                return res.send({ status: "Success" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(404).json({ status: 'ERR', message: 'Internal server error' });
    }
};


const resetPassword = async (req, res) => {
    const { id, token } = req.params
    const { password } = req.body
    // Kiểm tra độ dài mật khẩu
    if (!password) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The input is required'
        })
    } else if (password?.length < 8) {
        return res.status(200).json({
            status: 'ERR',
            message: 'Password should be at least 8 characters long'
        })
    }
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) {
            return res.json({ status: "Error with token" })
        } else {
            bcrypt.hash(password, 10)
                .then(hash => {
                    User.findByIdAndUpdate({ _id: id }, { password: hash })
                        .then(u => res.send({ status: "Success" }))
                        .catch(err => res.send({ status: err }))
                })
                .catch(err => res.send({ Status: err }))
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
    refreshToken,
    logoutUser,
    deleteMany,
    forgotPassword,
    resetPassword,
}