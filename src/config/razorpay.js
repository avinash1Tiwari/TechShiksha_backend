const Razorpay = require('razorpay')

const {ServerConfig} = require('./index.js')
const instance = new Razorpay({
    key_id : ServerConfig.RAZORPAY_KEY,
    key_secrete : ServerConfig.RAZORPAY_SECRETE
})

module.exports = {instance}