const UserRouter = require('../routes/UserRouter.js')
const ProductRouter = require('../routes/ProductRouter.js')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
}

module.exports = routes