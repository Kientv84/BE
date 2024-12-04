const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    discountAmount: { type: Number, default: null },
    branch: { type: String, default: null },
    minimumQuantity: { type: Number, default: 2 },
    triggerProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    bundleProduct: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Sản phẩm mua kèm
        discountPrice: { type: Number }, // Giá giảm cho sản phẩm mua kèm
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
module.exports = Promotion;
