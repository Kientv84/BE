const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    brand: { type: String, default: "any" },
    minimumQuantity: { type: Number, default: 2 },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
