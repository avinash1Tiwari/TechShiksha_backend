const { StatusCodes } = require('http-status-codes')
const Tags = require('../models/Tags')
const Category = require('../models/Category')


// const createTags = async (req,res) =>{
//     try{

//     }
//     catch(error)
//     {
//         console.log(error)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             success : false,
//             message : "Internal server error",
//             error : error.message
//         })
//     }
// }





const createCategory = async (req,res) =>{
    try{

        const {name,description} = req.body;

        // validation
        if(!name || !description)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success : false,
                message : "All fields required",
            })
        }


        // create entry in dB
        const categoryDetails = Category.create({
            name : name,
            description : description
        })

        console.log(categoryDetails)

       return res.status(StatusCodes.OK).json({
            success : success,
            message : "Successfully created the tag",
            categoryDetails : categoryDetails
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Internal server error",
            error : error.message
        })
    }
}



// getAllTags

const getAllCategories = async (req,res) =>{
    try{
        
        const allCategories = await Category.find({},{name:true,description:true})        
        //true represents, records fetched must contains the fields with true marked


        return res.status(StatusCodes.OK).json({
            success : false,
            message : "All tags returned successfully",
            allCategories : allCategories
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Internal server error",
            error : error.message
        })
    }
}


module.exports = {
    createCategory,
    getAllCategories
}