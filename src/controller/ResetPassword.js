const { StatusCodes } = require('http-status-codes');
const User = require('../models/User')
const mailSender = require('../utils/common/mailSender');
const {ServerConfig} = require('../config')




// resetPasswordToken
const resetPasswordToken = async (req,res) =>{

 try{
    const email = req.body.email;
    const user = User.findOne({email:email});

    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : 'Your email is not registered with us'
        })
    }

    const resetToken = crypto.randomUUID();

    const updatedDetails = await User.findOneAndUpdate(
        {email:email},{
            resetToken:resetToken,
            resetPasswordExpires : Date.now() + 5*60*1000
        },
        {new : true}   // this new is used to return the updated data at the same time from database
    )


    // create url for passwordchange
    const url = ServerConfig.RESET_LINK + token
    console.log("reset url : " , url)


    await mailSender(email,
        "Password Rest Link",
        `reset Link : ${url}`
    )

    return res.status(StatusCodes.OK).json({
        success : true,
        message : 'Email sent successfully, please check email and change your password'
    })
 }
 catch(error){

 }


}





// resetPassword
const resetPassword = async (req,res) =>{

   try{

    const {password,consfirmPassword,resetToken} = req.body;

    if(password !== consfirmPassword)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "Passwords not matching"
        })
    }


    const userDetails = User.findOne({resetToken:resetToken});

    if(!userDetails){
        return res.status(StatusCodes.BAD_REQUEST).json({
             success : false,
            message : "Token is invalid"
        })  
    }

    if(userDetails.resetPasswordExpires<Date.now())
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
           message : "Token is expired, please regenerate your token"
       })  
    }

    const saltRounds = parseInt(ServerConfig.SALT_ROUND, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    await User.findOneAndUpdate(
        {resetToken:resetToken},
        {password:hashedPassword},
        {new:true}
    )

    return res.status(StatusCodes.OK).json({
        success : true,
        message:'Password reset successfully'
    })


   }
   catch(error)
   {
    return res.status(StatusCodes.OK).json({
        success : false,
        message:'something went wrong',
        error : error.message
    })
   }

}