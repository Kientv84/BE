const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(404).json({
        status: "ERROR",
        message: "Authentication failed: " + err.message,
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERROR",
      });
    }
  });
};

// const authUserMiddleWare = (req, res, next) => {
//     const token = req.headers.token.split(' ')[1]
//     const userId = req.params.id
//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
//         if (err) {
//             console.error('JWT Verification Error:', err);
//             return res.status(404).json({
//                 status: 'ERR',
//                 message: 'Authentication failed: ' + err.message
//             });
//         }
//         if (user?.isAdmin || user?.id === userId) {
//             next()
//         } else {
//             return res.status(404).json({
//                 message: 'The authentication',
//                 status: 'ERR'
//             })
//         }
//     });
// }

const authUserMiddleWare = (req, res, next) => {
  // Lấy token từ headers
  const authHeader = req.headers.token;

  // Kiểm tra xem token có tồn tại và đúng định dạng không
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Lấy token từ chuỗi 'Bearer token'
    const userId = req.params.id;

    // Verify JWT token
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(401).json({
          status: "ERR",
          message: "Authentication failed: " + err.message,
        });
      }

      // Kiểm tra quyền admin hoặc id người dùng khớp với userId
      if (user?.isAdmin || user?.id === userId) {
        next();
      } else {
        return res.status(403).json({
          message: "Authorization failed: Insufficient permissions",
          status: "ERR",
        });
      }
    });
  } else {
    // Trả về lỗi nếu không có token hoặc không đúng định dạng
    return res.status(401).json({
      status: "ERR",
      message: "Token not provided or invalid format",
    });
  }
};

module.exports = {
  authMiddleWare,
  authUserMiddleWare,
};
