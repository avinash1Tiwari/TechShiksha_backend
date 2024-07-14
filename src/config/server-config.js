const dotenv = require('dotenv')

dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    DB_URL : process.env.MONGODB_URL,
    MAIL_HOST : process.env.MAIL_HOST,
    MAIL_USER : process.env.MAIL_USER,
    MAIL_PASS : process.env.MAIL_PASS,
    SALT_ROUND : process.env.SALT_ROUND,
    JWT_EXPIRE_TIME : process.env.JWT_EXPIRE_TIME,
    SECRETE_KEY : process.env.SECRETE_KEY,
    RESET_LINK : process.env.RESET_LINK
}