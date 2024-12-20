const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      typeofdelivery,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt,
      email,
    } = newOrder;

    const orderNumber = `#${Date.now().toString().slice(-5)}`;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          status: "ERR",
          message: `San pham voi id: ${arrId.join(",")} khong du hang`,
        });
      } else {
        const createdOrder = await Order.create({
          orderNumber,
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          typeofdelivery,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user: user,
          isPaid,
          paidAt,
        });
        if (createdOrder) {
          await EmailService.sendEmailCreateOrder(email, orderItems);
          resolve({
            status: "OK",
            message: "success",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get order details SUCCESS",
        data: order,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error,
      });
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });

      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get order details SUCCESS",
        data: order,
      });
    } catch (error) {
      console.error("Error generating tokens:", error);
      reject({
        status: "ERR",
        message: error,
      });
    }
  });
};

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      // Dùng map + Promise.all để đảm bảo tất cả các promises được giải quyết
      const promises = data.map(async (item) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: item.product,
            selled: { $gte: item.amount },
          },
          {
            $inc: {
              countInStock: item.amount, // Tăng lại số lượng trong kho
              selled: -item.amount, // Giảm số lượng đã bán
            },
          },
          { new: true }
        );

        if (productData) {
          const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { isDelivered: "cancelled", cancelledAt: new Date() },
            { new: true }
          );
          if (!updatedOrder) {
            resolve({
              status: "ERR",
              message: "The Order is not defined",
            });
            return; // Dừng lại nếu không tìm thấy order
          }
          return updatedOrder; // Trả về kết quả đã xóa
        } else {
          return {
            status: "ERR",
            message: "Product update failed or not found",
            id: item.product,
          };
        }
      });

      const results = await Promise.all(promises); // Chờ tất cả các promises được giải quyết

      const failedUpdates = results.filter((item) => item?.status === "ERR");
      if (failedUpdates.length > 0) {
        resolve({
          status: "ERR",
          message: `Some products failed to update: ${failedUpdates
            .map((item) => item.id)
            .join(", ")}`,
        });
      }

      resolve({
        status: "OK",
        message: "Order and product stock updated successfully",
        data: results,
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error.message || error,
      });
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().select(
        "_id orderNumber orderItems.name shippingAddress paymentMethod typeofdelivery totalPrice isPaid isDelivered createdAt"
      );
      resolve({
        status: "OK",
        message: "Get all order SUCCESS",
        data: allOrder,
      });
    } catch (error) {
      console.error("Error generating tokens:", error);
      reject({
        status: "ERR",
        message: error,
      });
    }
  });
};

const updateDeliveryState = (orderId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findById({
        _id: orderId,
      }).select("_id isPaid isDelivered");
      if (checkOrder === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      // Kiểm tra trạng thái hợp lệ trước khi cập nhật
      const validStatuses = [
        "cancelled",
        "successful order",
        "pending",
        "sended",
        "shipping",
        "delivery success",
        "delivery fail",
      ];
      if (!validStatuses.includes(data.isDelivered)) {
        resolve({
          status: "ERR",
          message: "Invalid delivery status",
        });
      }

      const updateFields = {};
      if (data.isDelivered === "pending") {
        updateFields.pendingAt = new Date();
      } else if (data.isDelivered === "sended") {
        updateFields.sendedAt = new Date();
      } else if (data.isDelivered === "shipping") {
        updateFields.shippingAt = new Date();
      } else if (data.isDelivered === "delivery success") {
        updateFields.deliverySuccessAt = new Date();
      } else if (data.isDelivered === "delivery fail") {
        updateFields.deliveryFailAt = new Date();
      } else if (data.isDelivered === "cancelled") {
        updateFields.cancelledAt = new Date(); // Đảm bảo cancelledAt được cập nhật
      }

      const updateOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          ...data,
          ...updateFields,
        },
        {
          new: true,
        }
      );

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: {
          isDelivered: updateOrder.isDelivered,
          isPaid: updateOrder.isPaid,
          cancelledAt: updateOrder.cancelledAt,
        },
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error,
      });
    }
  });
};

const updatePaymentState = (orderId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findById({
        _id: orderId,
      });
      if (!checkOrder) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      const updateOrder = await Order.findByIdAndUpdate(orderId, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: { isPaid: updateOrder.isPaid },
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error,
      });
    }
  });
};

const deleteOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findById({
        _id: id,
      }).select("_id isPaid isDelivered");
      if (checkOrder === null) {
        resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }
      await Order.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete order SUCCESS",
      });
    } catch (error) {
      reject({
        status: "ERR",
        message: error,
      });
    }
  });
};

const deleteManyOrder = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Order.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete orders success",
      });
    } catch (e) {
      reject(e);
    }
  });
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
  deleteManyOrder,
};
