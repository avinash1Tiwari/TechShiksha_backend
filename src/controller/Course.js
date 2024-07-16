const User = require('../models/User')

const Tags = require('../models/Category')
const Course = require('../models/Course')

const imgaeUploader = require('../utils/common/imgaeUploader')
const { StatusCodes } = require('http-status-codes')
const {ServerConfig} = require('../config')
const Category = require('../models/Category')

const cretaCourse = async (req,res) =>{

    try{

    const {courseName,courseDescription,instructor,whatYouWillLearn,
        ratingAndReveiws,tags,studentEnrolled,category
    } = req.body;

const thumbnail = req.files.thumbnailImage;

if(!courseName || !courseDescription || !whatYouWillLearn || !tags || !thumbnail || !category)
{
    return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message : "All fields are required"
    })
}

    // fetching instructor details,, as userId and instructor-object_id are same . so need not fetch details of instructor and finding it's object_id
    const userId = req.user.id;

    const instructorDetails = await User.findById(userId);
    console.log("Instructor details : ",instructorDetails)

    if(!instructorDetails)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "Instructor details not found"
        })
    }


    // check tagDetails
    const categoryDetails = await Tags.findById(category);
    if(!categoryDetails)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "category details not found"
        })
    }

    // upload thumbnail to cloudinary

    const thumbnailImage = await imgaeUploader(thumbnail,ServerConfig.FOLDER_NAME)


    // create entry for new course

    const newCourse = await Course.create({
        courseName,
        courseDescription,
        whatYouWillLearn,
        instructor : instructorDetails._id,
        tags,
        category :categoryDetails._id,
        thumbnail : thumbnailImage.secure_url,
        price,
    })


    // add newly created code instructor wala courses ke array me
    await User.findByIdAndUpdate(
        {_id:instructorDetails._id,},
            {
                $push : {
                    courses : newCourse._id,
                }
            },
            {new :true}
       
    )


    // update tag schema

    await Category.findByIdAndUpdate(
        {_id:tagDetails._id},
        {
            $push : {
                course :newCourse._id
            }
        }
    )


    return res.status(StatusCodes.OK).json({
        success : true,
        message : 'Successfully created the course',
        courseDetails : newCourse
    })


}
catch(error)
{
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success : false,
        message : 'something went wrong',
        error : error.message
    })
}
}




const showAllCourses = async(req,res) =>{
    try{


        const allcourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReveiws:true,
            studentEnrolled:true
        }).populate("instructor")
        .exec();

        console.log(allcourses)

        return res.status(StatusCodes.OK).json({
            success : true,
            message : 'successfully completed the request went wrong',
            data : allcourses
        })

    }
    catch(error)
{
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success : false,
        message : 'something went wrong',
        error : error.message
    })
}
}



module.exports = {
    cretaCourse,
    showAllCourses
}