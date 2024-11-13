const UserRouter = require("../routes/UserRouter.js");
const ProductRouter = require("../routes/ProductRouter.js");
const OrderRouter = require("../routes/OrderRouter.js");
const PaymentRouter = require("../routes/PaymentRouter.js");
const PromotionRouter = require("../routes/PromotionRouter.js");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/promotion", PromotionRouter);
};

module.exports = routes;
