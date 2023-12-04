const ProductService = require('../services/ProductService')
const sizeOf = require('image-size');

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description, discount } = req.body;

        // // Hàm kiểm tra định dạng ảnh
        // const isImageValid = (image) => {
        //     try {
        //         const dimensions = sizeOf(image);
        //         // Kiểm tra nếu là file ảnh
        //         return dimensions.type.startsWith('image');
        //     } catch (error) {
        //         // Xử lý lỗi khi đọc kích thước ảnh
        //         return false;
        //     }
        // };

        // // Kiểm tra định dạng ảnh
        // if (!isImageValid(image)) {
        //     return res.status(200).json({
        //         status: 'ERR',
        //         message: 'Invalid image format. Please upload a valid image file.'
        //     });
        // }

        // Kiểm tra nếu bất kỳ trường nào là chuỗi hoặc số âm
        if (typeof price !== "number" && price < 0) {
            return res.status(400).json({
                status: "ERR",
                message: "Price must be a positive number"
            });
        } else if (typeof countInStock !== "number" && countInStock <= 0) {
            return res.status(400).json({
                status: "ERR",
                message: "Quantity in stock must be a positive number"
            });
        } else if (typeof rating !== "number" && rating < 0 && rating > 5) {
            return res.status(400).json({
                status: "ERR",
                message: "Rating must be between 0 and 5"
            });
        } else if (typeof discount !== "number" && discount < 0) {
            return res.status(400).json({
                status: "ERR",
                message: "Discount must be a positive number"
            });
        }
        if (!name || !image || !type || !price || !countInStock || !rating || !discount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All input fields are required.'
            });
        }

        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product id is not exist'
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product id is not exist'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The product id is not exist'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductService.getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
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
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType
}