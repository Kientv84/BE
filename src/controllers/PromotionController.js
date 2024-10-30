const createPromotion = async (req, res) => {
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
      !promotion ||
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

module.exports = {
  createPromotion,
};
