const ProductService = require("../services/ProductService");
const sizeOf = require("image-size");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      type,
      branch,
      price,
      countInStock,
      rating,
      description,
      promotion,
      discount,
      image1,
      image2,
    } = req.body;

    if (
      !name ||
      !image ||
      !type ||
      !branch ||
      !price ||
      !countInStock ||
      !rating ||
      discount === undefined || // Chấp nhận `0` nhưng không để trống
      !description ||
      // !promotion ||
      !(promotion && promotion.promotionText) || // Kiểm tra promotion tồn tại trước
      !image1 ||
      !image2
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "All input fields are required.",
      });
    }

    // Tạo trường normalizedName
    const normalizedName = removeVietnameseTones(name.toLowerCase());

    const newProductData = {
      ...req.body,
      normalizedName,
    };

    const response = await ProductService.createProduct(newProductData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred while creating the product.",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The product id is not exist",
      });
    }

    if (data.name) {
      data.normalizedName = removeVietnameseTones(data.name.toLowerCase());
    }

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The product id is not exist",
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The product id is not exist",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllSearch = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllSearch(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9 ]/g, "") // Loại bỏ ký tự đặc biệt
    .trim();
};

const getAllsearchProducts = async (req, res) => {
  try {
    const keyword = req.query.q; // Lấy từ khóa tìm kiếm từ query string

    const response = await ProductService(keyword);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message || "An error occurred",
    });
  }
};

const getAllBranch = async (req, res) => {
  try {
    const response = await ProductService.getAllBranch();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteMany,
  getAllType,
  getAllBranch,
  getAllsearchProducts,
  getAllSearch,
};
