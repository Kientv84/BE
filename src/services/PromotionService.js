const Promotion = require("../models/PromotionModel");

const createPromotion = (newPromotion) => {
  return new Promise(async (resolve, reject) => {
    const {
      month,
      year,
      discountAmount,
      branch,
      minimumQuantity = 2,
      triggerProduct,
      bundleProduct,
      discountPrice,
    } = newPromotion;

    try {
      // Kiểm tra xem đã tồn tại khuyến mãi cho tháng, năm, và thương hiệu này chưa
      let queryConditions = {};

      // Kiểm tra các trường nếu có giá trị
      if (triggerProduct) queryConditions.triggerProduct = triggerProduct;
      if (month) queryConditions.month = month;
      if (year) queryConditions.year = year;
      if (branch) queryConditions.branch = branch;

      // Tìm khuyến mãi có cùng các điều kiện trên
      const existingPromotion = await Promotion.findOne(queryConditions);

      // Nếu có khuyến mãi trùng với điều kiện trên, từ chối việc tạo mới
      if (existingPromotion) {
        return reject({
          status: "ERR",
          message:
            "A promotion for this month, year, branch, and trigger product already exists.",
        });
      }

      // Kiểm tra nếu triggerProduct có trong bundleProduct
      if (bundleProduct && bundleProduct.length > 0) {
        const isTriggerInBundle = bundleProduct.some(
          (bundle) => bundle.productId === triggerProduct
        );

        if (isTriggerInBundle) {
          return reject({
            status: "ERR",
            message:
              "Trigger product cannot be the same as any product in the bundle.",
          });
        }
      }

      // Kiểm tra xem có sản phẩm trùng trong bundleProduct không
      const isDuplicateInBundle = bundleProduct.some((bundle, index) =>
        bundleProduct.some(
          (otherBundle, otherIndex) =>
            otherIndex !== index && bundle.productId === otherBundle.productId
        )
      );

      if (isDuplicateInBundle) {
        return reject({
          status: "ERR",
          message: "Duplicate products found in the bundle.",
        });
      }

      // Tạo dữ liệu cho khuyến mãi mới
      const promotionData = {
        month,
        year,
        discountAmount,
        branch,
        minimumQuantity,
        triggerProduct,
      };

      // Nếu có `bundleProduct` và `discountPrice`, thêm `bundleProduct` vào dữ liệu khuyến mãi
      if (Array.isArray(bundleProduct) && bundleProduct.length > 0) {
        promotionData.bundleProduct = bundleProduct.map((bundle) => ({
          productId: bundle.productId,
          discountPrice: discountPrice,
        }));
      }

      // Tạo khuyến mãi mới
      const newPromotion = await Promotion.create(promotionData);

      if (newPromotion) {
        return resolve({
          status: "OK",
          message: "Promotion created successfully.",
          data: newPromotion,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "An error occurred while creating the promotion.",
      });
    }
  });
};

const updatePromotion = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPromotion = await Promotion.findById({
        _id: id,
      });
      if (checkPromotion === null) {
        resolve({
          status: "ERR",
          message: "The promotion is not defined",
        });
      }

      // Kiểm tra sự trùng lặp trong dữ liệu cập nhật (bao gồm triggerProduct, month, year, branch)
      let queryConditions = {}; // Dùng data.triggerProduct thay vì triggerProduct

      // Chỉ kiểm tra các trường month, year, branch nếu có giá trị trong data
      if (data.triggerProduct)
        queryConditions.triggerProduct = data.triggerProduct;
      if (data.month) queryConditions.month = data.month;
      if (data.year) queryConditions.year = data.year;
      if (data.branch) queryConditions.branch = data.branch;

      // Loại trừ bản ghi hiện tại (đang được cập nhật)
      queryConditions._id = { $ne: id };

      const existingPromotion = await Promotion.findOne(queryConditions);

      if (existingPromotion) {
        return reject({
          status: "ERR",
          message:
            "A promotion for this month, year, branch, and trigger product already exists.",
        });
      }

      if (data.bundleProduct && data.bundleProduct.length > 0) {
        const isTriggerInBundle = data.bundleProduct.some(
          (bundle) => bundle.productId === data.triggerProduct
        );

        if (isTriggerInBundle) {
          return reject({
            status: "ERR",
            message:
              "Trigger product cannot be the same as any product in the bundle.",
          });
        }
      }

      const isDuplicateInBundle = data.bundleProduct.some((bundle, index) =>
        data.bundleProduct.some(
          (otherBundle, otherIndex) =>
            otherIndex !== index && bundle.productId === otherBundle.productId
        )
      );

      if (isDuplicateInBundle) {
        return reject({
          status: "ERR",
          message: "Duplicate products found in the bundle.",
        });
      }

      if (Array.isArray(data.bundleProduct)) {
        data.bundleProduct = data.bundleProduct.map((item) => ({
          productId: item.productId,
          discountPrice: item.discountPrice || 0, // Gán giá trị mặc định nếu discountPrice không có
        }));
      }

      const updatePromotion = await Promotion.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatePromotion,
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

const getDetailsPromotion = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const promotion = await Promotion.findOne({
        _id: id,
      });
      if (promotion === null) {
        resolve({
          status: "ERR",
          message: "The promotion is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get promotion details SUCCESS",
        data: promotion,
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

const deletePromotion = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPromotion = await Promotion.findById({ _id: id });
      if (!checkPromotion) {
        return resolve({
          status: "ERR",
          message: "The promotion does not exist",
        });
      }
      await Promotion.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete promotion SUCCESS",
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: "Failed to delete promotion",
      });
    }
  });
};

const getAllPromotion = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalPromotion = await Promotion.countDocuments();
      let allPromotion = [];

      const query = Promotion.find()
        .populate("triggerProduct", "name")
        .populate("bundleProduct.productId", "name") // Lấy tên sản phẩm
        .limit(limit)
        .skip(page * limit)
        .sort({ createdAt: -1, updatedAt: -1 });

      if (filter) {
        const label = filter[0];
        query.where(label).regex(new RegExp(filter[1], "i"));
      }

      if (sort) {
        const sortOption = {};
        sortOption[sort[1]] = sort[0];
        query.sort(sortOption);
      }

      allPromotion = await query;

      resolve({
        status: "OK",
        message: "Success",
        data: allPromotion,
        total: totalPromotion,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalPromotion / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyPromotion = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Promotion.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete promotion success",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Failed to delete promotions",
      });
    }
  });
};

module.exports = {
  createPromotion,
  updatePromotion,
  getDetailsPromotion,
  deletePromotion,
  getAllPromotion,
  deleteManyPromotion,
};
