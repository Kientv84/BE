const PromotionService = require("../services/PromotionService");

const createPromotion = async (req, res) => {
  try {
    const {
      month,
      year,
      discountAmount,
      branch,
      minimumQuantity,
      triggerProduct,
      bundleProduct,
      discountPrice,
    } = req.body;

    if (month == null || year == null) {
      return res.status(400).json({
        status: "ERR",
        message: "Month, year are required.",
      });
    }

    // Tạo khuyến mãi mới
    const newPromotion = await PromotionService.createPromotion({
      month,
      year,
      discountAmount: discountAmount || null,
      branch: branch || null,
      minimumQuantity: minimumQuantity || 2,
      triggerProduct,
      bundleProduct,
      discountPrice,
    });

    return res.status(200).json({
      status: "OK",
      message: "Promotion created successfully.",
      data: newPromotion,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message || "An error occurred while creating the promotion.",
    });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const promotionId = req.params.id;
    const data = req.body;
    if (!promotionId) {
      return res.status(200).json({
        status: "ERR",
        message: "The promotion id is not exist",
      });
    }

    const response = await PromotionService.updatePromotion(promotionId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message || "An error occurred while updating the promotion",
    });
  }
};

const getDetailsPromotion = async (req, res) => {
  try {
    const promotionId = req.params.id;
    if (!promotionId) {
      return res.status(200).json({
        status: "ERR",
        message: "The promotion id is not exist",
      });
    }
    const response = await PromotionService.getDetailsPromotion(promotionId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const promotionId = req.params.id;
    if (!promotionId) {
      return res.status(200).json({
        status: "ERR",
        message: "The promotion id does not exist",
      });
    }
    const response = await PromotionService.deletePromotion(promotionId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllPromotion = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await PromotionService.getAllPromotion(
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
    const response = await PromotionService.deleteManyPromotion(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createPromotion,
  updatePromotion,
  getDetailsPromotion,
  deletePromotion,
  getAllPromotion,
  deleteMany,
};
