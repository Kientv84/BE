const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      image1,
      image2,
      type,
      branch,
      price,
      countInStock,
      rating,
      description,
      promotion,
      discount,
    } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        return resolve({
          status: "ERR",
          message: "The name of product is already exist",
        });
      }

      const promotionData = promotion
        ? {
            promotionText: promotion.promotionText || "",
            ...(promotion.relatedProductId
              ? { relatedProductId: promotion.relatedProductId }
              : {}),
          }
        : null;

      const normalizedName = removeVietnameseTones(name.toLowerCase());
      const newProduct = await Product.create({
        name,
        normalizedName,
        image,
        image1,
        image2,
        type,
        branch,
        price,
        countInStock: Number(countInStock),
        rating,
        description,
        promotion: promotionData,
        discount: Number(discount),
      });

      if (newProduct) {
        return resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      // Cập nhật normalizedName nếu có thay đổi name
      if (data.name) {
        data.normalizedName = removeVietnameseTones(data.name.toLowerCase());
      }
      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateProduct,
      });
    } catch (error) {
      console.error("Error generating tokens:", error);
      reject({
        status: "ERR",
        message: "Token generation failed",
      });
    }
  });
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

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get product details SUCCESS",
        data: product,
      });
    } catch (error) {
      console.error("Error generating tokens:", error);
      reject({
        status: "ERR",
        message: "Token generation failed",
      });
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product SUCCESS",
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: "Token generation failed",
      });
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {}; // Khởi tạo đối tượng query rỗng

      // Nếu có filter, áp dụng bộ lọc tìm kiếm
      if (filter) {
        const label = filter[0];
        const keyword = filter[1];
        query = {
          $or: [
            { [label]: { $regex: keyword, $options: "i" } },
            { normalizedName: { $regex: keyword, $options: "i" } },
          ],
        };
      }

      const totalProduct = await Product.countDocuments(query); // Đếm số sản phẩm với bộ lọc hiện tại

      let allProduct = [];

      // Xử lý sắp xếp nếu có yêu cầu
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        allProduct = await Product.find(query)
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 }); // Sắp xếp theo createdAt và updatedAt
      } else {
        // Nếu không có yêu cầu sắp xếp
        allProduct = await Product.find(query)
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      // Nếu không có `limit`, lấy toàn bộ sản phẩm
      if (!limit) {
        allProduct = await Product.find(query).sort({
          createdAt: -1,
          updatedAt: -1,
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit), // Tính số trang dựa trên tổng sản phẩm và giới hạn
      });
    } catch (e) {
      reject({
        status: "ERROR",
        message: e.message || "Something went wrong!",
      });
    }
  });
};

const getAllSearch = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {}; // Khởi tạo đối tượng query rỗng

      // Nếu có filter, áp dụng bộ lọc tìm kiếm
      if (filter) {
        const label = filter[0];
        const keyword = filter[1];
        query = {
          $or: [
            { [label]: { $regex: keyword, $options: "i" } },
            { normalizedName: { $regex: keyword, $options: "i" } },
          ],
        };
      }

      const totalProduct = await Product.countDocuments(query); // Đếm số sản phẩm với bộ lọc hiện tại

      let allProduct = [];

      // Xử lý sắp xếp nếu có yêu cầu
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        allProduct = await Product.find(query)
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 }); // Sắp xếp theo createdAt và updatedAt
      } else {
        // Nếu không có yêu cầu sắp xếp
        allProduct = await Product.find(query)
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      // Nếu không có `limit`, lấy toàn bộ sản phẩm
      if (!limit) {
        allProduct = await Product.find(query).sort({
          createdAt: -1,
          updatedAt: -1,
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit), // Tính số trang dựa trên tổng sản phẩm và giới hạn
      });
    } catch (e) {
      reject({
        status: "ERROR",
        message: e.message || "Something went wrong!",
      });
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllBranch = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allBranch = await Product.distinct("branch");
      resolve({
        status: "OK",
        message: "Success",
        data: allBranch,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
  getAllBranch,
  getAllSearch,
};
