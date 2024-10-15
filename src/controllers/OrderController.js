const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
    } = req.body;
    if (
      !paymentMethod ||
      !itemsPrice ||
      shippingPrice == null ||
      !totalPrice ||
      !fullName ||
      !address ||
      !city ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllDetailsOrder = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is not exist",
      });
    }
    const response = await OrderService.getAllDetailsOrder(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is not exist",
      });
    }
    const response = await OrderService.getDetailsOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const cancelOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;

    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "The Order Id is not exist",
      });
    }

    const response = await OrderService.cancelOrderDetails(orderId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: error.message || "Internal Server Error",
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const data = await OrderService.getAllOrder();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateDeliveryState = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The order id is not exist",
      });
    }
    const response = await OrderService.updateDeliveryState(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updatePaymentState = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "Order ID is missing or invalid",
      });
    }

    const response = await OrderService.updatePaymentState(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: `An error occurred: ${e.message}`,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The order id is not exist",
      });
    }
    const response = await OrderService.deleteOrder(orderId);
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
    const response = await OrderService.deleteManyOrder(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllDetailsOrder,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
  updateDeliveryState,
  updatePaymentState,
  deleteOrder,
  deleteMany,
};
