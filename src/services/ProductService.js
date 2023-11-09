const Product = require('../models/ProductModel');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already have'
                })
            }
            const newProduct = await Product.create({
                name, image, type, price, countInStock, rating, description
            })
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                })
            }
            console.log(newUser)
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findById({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }
            // console.log('checkProduct', checkProduct)
            const updateProduct = await Product.findByIdAndUpdate(id, data, {new : true})
            console.log('updateUser', updateProduct)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct
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

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Get product details SUCCESS',
                data: product
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

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findById({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product SUCCESS',
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

const deleteManyProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete product SUCCESS',
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

const getAllProduct = ( limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.count()
            if(filter) {
                const label = filter[0]
                const allFilterProduct = await Product.find({ [label]: { '$regex': filter[1]} }).limit(limit).skip(limit * page)
                resolve({
                    status: 'OK',
                    message: 'Filter product SUCCESS',
                    data: allFilterProduct,
                    totalProduct: totalProduct,
                    currentPage: Number(page + 1),
                    totalPage: Math.ceil( totalProduct / limit)
                })
            }
            if(sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                console.log('objectSort', objectSort)
                const allProductSort = await Product.find().limit(limit).skip(limit * page).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Get all product SUCCESS',
                    data: allProductSort,
                    totalProduct: totalProduct,
                    currentPage: page + 1,
                    totalPage: Math.ceil( totalProduct / limit)
                })
            }
            const allProduct = await Product.find().limit(limit).skip(limit * page)
            resolve({
                status: 'OK',
                message: 'Get all product SUCCESS',
                data: allProduct,
                totalProduct: totalProduct,
                currentPage: page + 1,
                totalPage: Math.ceil( totalProduct / limit)
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
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
}