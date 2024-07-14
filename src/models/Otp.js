const mongoose = require('mongoose')
const mailSender = require('../utils/common/mailSender');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');


const otpSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default:Date.now(),
        expires : 5*60           // 5 mins
    }
})

// function => to send email
const sendVerificationMail = async (email,otp) =>{
    try{

        const mailResponse = await mailSender(email,'Verification mail from TechShiksha',otp);
        console.log('email sent successfully : ',mailResponse)
    }
    catch(error){
        console.log('error occured while sending mail ',error);
        throw new AppError('error occured while sending mail ', StatusCodes.INTERNAL_SERVER_ERROR)

    }

}


otpSchema.pre('save',async function(next){
    await sendVerificationMail(this.email,this.otp);
    next();

})

module.exports = mongoose.model('Otp',otpSchema)