// auth
const jwt = require('jsonwebtoken')
const {ServerConfig} = require('../config')
const { StatusCodes } = require('http-status-codes')

const auth = async (req,res,next) =>{
  try{
    const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","")

    if(!token){
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : 'Token is missing'
        })
    }

    try{

        const decode =  jwt.verify(token,ServerConfig.SECRETE_KEY)

        console.log(decode)
        req.user = decode
    }
    catch(error){
        // verification issue
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : 'Token is invalid'
        })
    }

    next()
}
catch(error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success : false,
        message : 'Something went wrong while validating the token'
    })
}
}





// isStudent


const isStudent = async(req,res,next)=>{
    try{

        if(req.user.accountType !== "Student"){
            return res.status(StatusCodes.BAD_REQUEST).json({
                success : false,
                message : 'This is a protected route for student only'
            })
        }

        next()
    }
    catch(error){
 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success : false,
        message : 'user role could not be verified , try again'
    })
    }
}
// isInstructor

const isInstructor = async(req,res,next)=>{
    try{

        if(req.user.accountType !== "Instructor"){
            return res.status(StatusCodes.BAD_REQUEST).json({
                success : false,
                message : 'This is a protected route for instructor only'
            })
        }

        next()
    }
    catch(error){
 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success : false,
        message : 'user role could not be verified , try again'
    })
    }
}









// isAdmin
const isAdmin = async(req,res,next)=>{
    try{

        if(req.user.accountType !== "Admin"){
            return res.status(StatusCodes.BAD_REQUEST).json({
                success : false,
                message : 'This is a protected route for admin only'
            })
        }

        next()
    }
    catch(error){
 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success : false,
        message : 'user role could not be verified , try again'
    })
    }
}

