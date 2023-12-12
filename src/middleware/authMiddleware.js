const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(404).json({
                status: 'ERROR',
                message: 'Authentication failed: ' + err.message
            });
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(404).json({
                status: 'ERR',
                message: 'Authentication failed: ' + err.message
            });
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERR'
            })
        }
    });
}


module.exports = {
    authMiddleWare,
    authUserMiddleWare
}