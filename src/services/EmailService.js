const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { convertPrice } = require('../Utils/utils')

dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');
const User = require("../models/UserModel");

const sendEmailCreateOrder = (email, orderItems) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        }
    });
    transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));

    let listItems = ''
    const attachImage = []

    orderItems.forEach((order) => {
        listItems +=
            `<div> 
                <div>You ordered <b>${order.name}</b> products in quantity <b>${order.amount}</b> with price <b>${convertPrice(order.price)}</b> </div>
            </div>`
        attachImage.push({ path: order.image })
    })

    listItems = `<div><b>Congratulations on your successful order</b></div>${listItems}`;

    // Thêm "Below are images of the product" ở cuối listItems
    listItems += '<div>Below are images of the product</div>';

    const findUserByEmail = async (email) => {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error('Lỗi khi tìm người dùng:', error);
            throw error; // Xử lý hoặc đăng nhập lỗi theo cách cần thiết
        }
    };

    const sendMail = async (user) => {
        try {
            const info = await transporter.sendMail({
                from: process.env.MAIL_ACCOUNT,
                to: user?.email,
                subject: 'You have successfully placed an order at WEBPHONE',
                html: `${listItems}`,
                attachments: attachImage,
            });
            // console.log("Message sent: %s", info.messageId);
        } catch (error) {
            console.error('Lỗi khi gửi email:', error);
            throw error; // Xử lý hoặc đăng nhập lỗi theo cách cần thiết
        }
    };

    // async..await không được phép ở phạm vi toàn cục, phải sử dụng một bọc
    (async () => {
        try {
            const user = await findUserByEmail(email);

            if (!user) {
                // Xử lý trường hợp không tìm thấy người dùng
                console.error('No user found for email:', email);
                return;
            }

            await sendMail(user);
        } catch (error) {
            console.error('Error in main function:', error);
        }
    })();

}

module.exports = {
    sendEmailCreateOrder,
}