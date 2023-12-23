const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const EmailService = require('../services/EmailService')

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
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
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
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
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${arrId.join(',')} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city, phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, paidAt
                })
                if (createdOrder) {
                    await EmailService.sendEmailCreateOrder(email, orderItems)
                    resolve({
                        status: 'OK',
                        message: 'success'
                    })
                }
            }
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
            reject({
                status: 'ERR',
                message: error
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
                message: error
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
                message: error
            });
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const allOrder = await Order.find()
                .select('_id shippingAddress paymentMethod totalPrice isPaid isDelivered')
            resolve({
                status: 'OK',
                message: 'Get all order SUCCESS',
                data: allOrder
            })
        } catch (error) {
            console.error('Error generating tokens:', error);
            reject({
                status: 'ERR',
                message: error
            });
        }
    })
}

const updateDeliveryState = (orderId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findById({
                _id: orderId
            }).select('_id isPaid isDelivered')
            if (checkOrder === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            const updateOrder = await Order.findByIdAndUpdate(orderId, data, { new: true })
            // console.log('updateOrder', updateOrder)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: {
                    isDelivered: updateOrder.isDelivered,
                    isPaid: updateOrder.isPaid
                }
            })
        } catch (error) {
            reject({
                status: 'ERR',
                message: error
            });
        }
    })
}

const updatePaymentState = (orderId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findById({
                _id: orderId
            })
            if (checkOrder === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            const updateOrder = await Order.findByIdAndUpdate(orderId, data, { new: true })
            // console.log('updateOrder', updateOrder)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: { isPaid: updateOrder.isPaid }
            })
        } catch (error) {
            reject({
                status: 'ERR',
                message: error
            });
        }
    })
}

const deleteOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findById({
                _id: id
            }).select('_id isPaid isDelivered')
            if (checkOrder === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }
            await Order.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete order SUCCESS',
            })
        } catch (error) {
            reject({
                status: 'ERR',
                message: error
            });
        }
    })
}

const deleteManyOrder = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Order.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete orders success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllDetailsOrder,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    updateDeliveryState,
    updatePaymentState,
    deleteOrder,
    deleteManyOrder
}