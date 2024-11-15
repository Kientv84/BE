const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    orderItems: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number },
        branch: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: Number, required: true },
    },
    paymentMethod: { type: String, required: true },
    typeofdelivery: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: {
      type: String,
      enum: [
        "cancelled",
        "successful order",
        "pending",
        "sended",
        "shipping",
        "delivery success",
        "delivery fail",
      ],
      default: "successful order",
    },
    cancelledAt: { type: Date },
    pendingAt: { type: Date },
    sendedAt: { type: Date },
    shippingAt: { type: Date },
    deliverySuccessAt: { type: Date },
    deliveryFailAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
