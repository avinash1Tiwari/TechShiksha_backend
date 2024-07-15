const { StatusCodes } = require('http-status-codes')
const Tags = require('../models/Tags')


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





const createTags = async (req,res) =>{
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
        const tagDetails = Tags.create({
            name : name,
            description : description
        })

        console.log(tagDetails)

       return res.status(StatusCodes.OK).json({
            success : success,
            message : "Successfully created the tag",
            tagDetails : tagDetails
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

const getAllTags = async (req,res) =>{
    try{
        
        const allTags = await Tags.find({},{name:true,description:true})        
        //true represents, records fetched must contains the fields with true marked


        return res.status(StatusCodes.OK).json({
            success : false,
            message : "All tags returned successfully",
            tags : allTags
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
    createTags,
    getAllTags
}