const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config()

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

    let listItems = ''
    orderItems.forEach((order) => {
        listItems +=
            `<div> 
        <div>Bạn đã đặt các sản phẩm <b>${order.name}</b> với số lượng <b>${order.amount}</b> với giá <b>${order.price} VNĐ</b> </div>
        <div> <img src=${order.image} alt="sản phẩm"/> 
        </div>`
    })

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.MAIL_ACCOUNT, // sender address
            to: "hvo0512@gmail.com", // list of receivers
            subject: "Bạn đã đặt hàng thành công tại WEBPHONE", // Subject line
            text: "Hello world?", // plain text body
            html: `<div><b>Chúc mừng bạn đã đặt hàng thành công</b></div> ${listItems}`, // html body
        });

        // console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);
}

module.exports = {
    sendEmailCreateOrder,
}