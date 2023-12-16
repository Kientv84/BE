const mongoose = require('mongoose')
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: Number },
        address: { type: String },
        avatar: { type: String },
        // access_token: { type: String, required: true },
        // refresh_token: { type: String, required: true}
        city: { type: String },
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);


module.exports = User;