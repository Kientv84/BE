const {
  generalAccessToken2,
  generalAccessToken,
  generalRefreshToken,
} = require("../services/JwtService");
const UserService = require("../services/UserService");

const loginSuccess = async (req, res) => {
  const { id } = req?.body;

  if (!id) {
    return res.status(400).json({
      status: "Error",
      msg: "Missing inputs",
    });
  }

  try {
    const user = await UserService.getDetailsUser(id);

    // Nếu người dùng tồn tại, trả về thông tin và token
    if (user.status === "OK") {
      const access_token = await generalAccessToken({
        id: user.data._id,
        isAdmin: user.data.isAdmin,
      });
      const refresh_token = await generalRefreshToken({
        id: user.data._id,
        isAdmin: user.data.isAdmin,
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false, // Thay đổi thành true nếu triển khai trên HTTPS
        sameSite: "strict",
      });

      return res.status(200).json({
        status: "OK",
        msg: "Login success",
        access_token,
        refresh_token,
      });
    }

    return res.status(400).json({
      status: "ERR",
      msg: "User not found",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERR",
      msg: "Fail at login controller: " + error.message,
    });
  }
};

module.exports = {
  loginSuccess,
};
