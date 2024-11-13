const express = require("express");
const router = express.Router();
const PromotionController = require("../controllers/PromotionController.js");
const { authMiddleWare } = require("../middleware/authMiddleware.js");

router.post("/create", PromotionController.createPromotion);
router.put("/update/:id", authMiddleWare, PromotionController.updatePromotion);
router.get("/get-details/:id", PromotionController.getDetailsPromotion);
router.delete(
  "/delete/:id",
  authMiddleWare,
  PromotionController.deletePromotion
);
router.get("/get-all", PromotionController.getAllPromotion);
router.post("/delete-many", authMiddleWare, PromotionController.deleteMany);

module.exports = router;
