const Profile = require('../models/Profile')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const Course = require('../models/Course')

const updateProfile = async(req,res)=>{
    try{

        const {dateOfBirth="",about="",gender,contactNumber} = req.body;

        const userId = req.user.id;

        if(!contactNumber || !gender || userId)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success : false,
                message : "all fields are required"
            })
        }

        const userDetails = User.findById(userId);

        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.gender = gender
        profileDetails.contactNumber = contactNumber

        profileDetails.save();

        return res.status(StatusCodes.OK).json({
            success:true,
            message : "profile updated successfully",
            profileDetails
        })
    }
    catch(error)
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message : "something went wrong"
        })
    }
}







const deleteAccount = async (req,res)=>{
    try{

        const userId = req.user.id;

        if(!userId)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success:false,
                message : "userId not found"
            })
        }


        const user = User.findById(userId)
        if(!user)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success:false,
                message : "no such user present"
            })
        }


        // const userProfile = await Profile.findByIdAndDelete(user.additionalDetails);
        const userProfile = await Profile.findByIdAndDelete({_id : user.additionalDetails});



       // HW : unenroll user from all enrolled courses
        
       const useEnrolledCourses = user.courses;
    
       useEnrolledCourses.map(async (courseid) => {

        const updatedCourse = await Course.findByIdAndUpdate(
            courseid,
            { $pull: { studentEnrolled: userId } }, // Remove userId from the array
            { new: true } // Return the updated document
          );
       })




        const delteFromUser = await User.findByIdAndDelete(userId)

        return res.status(StatusCodes.OK).json({
            success:true,
            message : "user deleted successfully"
        })

    }
    catch(error)
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message : "something went wrong"
        })
    }
}




const getAllDetails = async (req,res)=>{
    try{

        const userId = req.user.id;

        const getAllDetails = await User.findById(userId).populate("additionalDetails").exec();


        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:true,
            getAllDetails
        })

    }
    catch(error)
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message : "something went wrong"
        })
    }
}


module.exports = {
    updateProfile,
    deleteAccount,
    getAllDetails
}