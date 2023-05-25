const nodemailer = require("nodemailer");

const isDevelopment = process.env.SERVER_MOOD == "development";
var transporter = nodemailer.createTransport({
  host: isDevelopment
    ? process.env.DEV_MAIL_HOST
    : process.env.PRODUCTION_MAIL_HOST,
  port: isDevelopment
    ? process.env.DEV_MAIL_PORT
    : process.env.PRODUCTION_MAIL_PORT,
  auth: {
    user: isDevelopment
      ? process.env.DEV_MAIL_USER
      : process.env.PRODUCTION_MAIL_USER,
    pass: isDevelopment
      ? process.env.DEV_MAIL_PASSWORD
      : process.env.PRODUCTION_MAIL_PASSWORD,
  },
});

module.exports = { transporter };
