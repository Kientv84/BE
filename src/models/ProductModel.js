const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    type: { type: String, required: true },
    branch: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String },
    // promotion: { type: String },
    promotion: {
      promotionText: { type: String }, // Nội dung hiển thị cho khuyến mãi
      relatedProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }, // ID sản phẩm liên quan
    },
    discount: { type: Number },
    selled: { type: Number },
    normalizedName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.normalizedName = removeVietnameseTones(this.name.toLowerCase());
  next();
});

// Hàm chuẩn hóa tên sản phẩm (loại bỏ dấu tiếng Việt)
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim();
};
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
