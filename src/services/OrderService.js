const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        // console.log('newOrder', newOrder)
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt } = newOrder
        try {
            // console.log('orderItems', { orderItems })
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    const createdOrder = await Order.create({
                        orderItems,
                        shippingAddress: {
                            fullName,
                            address,
                            city,
                            phone
                        },
                        paymentMethod,
                        itemsPrice,
                        shippingPrice,
                        totalPrice,
                        user: user,
                        isPaid,
                        paidAt
                    })
                    if (createdOrder) {
                        return {
                            status: 'OK',
                            message: 'SUCCESS',
                        }
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        data: [order.product]
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                resolve({
                    status: 'OK',
                    message: `Sản phẩm id${newData.join(',')} không đủ hàng trong kho`
                })
            }
            resolve({
                status: 'OK',
                message: 'Success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            // console.log('order1', order)
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Get order details SUCCESS',
                data: order
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

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            // console.log('order1', order)
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Get order details SUCCESS',
                data: order
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

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },
                    { new: true }
                )
                // console.log('productdata', productData)
                if (productData) {
                    order = await Order.findByIdAndDelete({
                        _id: id
                    })
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The Order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                resolve({
                    status: 'OK',
                    message: `Sản phẩm id${newData.join(',')} không tồn tại`
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })


        } catch (error) {
            reject({
                status: 'ERR',
                message: 'Token generation failed'
            });
        }
    })
}

module.exports = {
    createOrder,
    getAllDetailsOrder,
    getDetailsOrder,
    cancelOrderDetails
}