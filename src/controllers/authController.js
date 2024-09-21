const { generalAccessToken2 } = require("../services/JwtService");
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
      const access_token = await generalAccessToken2({
        id: user.data._id,
        isAdmin: user.data.isAdmin,
      });

      return res.status(200).json({
        status: "OK",
        msg: "Login success",
        access_token,
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
