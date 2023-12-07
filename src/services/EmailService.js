const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { convertPrice } = require('../Utils/utils')

dotenv.config()
var inlineBase64 = require('nodemailer-plugin-inline-base64');

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
        <div>Below are images of the product</div>
        </div>`
        attachImage.push({ path: order.image })
    })

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.MAIL_ACCOUNT, // sender address
            to: email, // list of receivers
            subject: "You have successfully placed an order at WEBPHONE", // Subject line
            text: "Hello world?", // plain text body
            html: `<div><b>Congratulations on your successful order</b></div> ${listItems}`, // html body
            attachments: attachImage,
        });

        // console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);
}

module.exports = {
    sendEmailCreateOrder,
}