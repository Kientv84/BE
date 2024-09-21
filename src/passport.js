const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const passport = require("passport");
const User = require("./models/UserModel");
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, callback) {
      try {
        // Kiểm tra xem user có tồn tại không bằng email
        let user = await User.findOne({ email: profile.emails[0]?.value });
        // Kiểm tra xem user có tồn tại hay không và cập nhật/thêm mới
        if (!user) {
          user = new User({
            // googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0]?.value,
            password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10), // Tạo mật khẩu ngẫu nhiên và hash
            isAdmin: false,
            avatar: profile?.photos[0]?.value,
          });

          await user.save();
        }
        return callback(null, user);
      } catch (error) {
        console.error("Error during Google login:", error);
        return callback(error, null);
      }
    }
  )
);
