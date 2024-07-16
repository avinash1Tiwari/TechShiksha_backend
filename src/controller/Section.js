const Section = require('../models/Section')
const {StatusCodes} = require('http-status-codes')
const Course = require('../models/Course')

exports.createSection = async(req,res) =>{

    try{

//   the courseid can easily be sent from frontend, as on clicking on a perticular course , we can store its courseid 
    const {courseName,courseId} = req.body;


    if(!courseName  || !courseId )
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "All fields are required"
        })

    }
        const newSection = await Section.create({sectionName})

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push : {
                    courseContent : newSection._id,
                }
            },
            {new:true}
        )

        // hw : use populate method to replace section_id/subsection_id with their actual content
        //  in the updatedCourseDetails

        return res.status(StatusCodes.OK).json({
            success : true,
            message : 'successfully created a section',
            updatedCourseDetails,
        })
    }
    catch(error)
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : true,
            message : 'something went wrong during creating the section, please try again',
            error : error.message
        })
    }
}



 exports.updateSection = async (req,res) =>{

    try{
            // 1. fetch data
    const {sectionName,sectionId} = req.body;


    // 2. data validation
    if(!sectionName || !sectionId)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "All fields are required",
        })
    }

    // 3. update data

    const updatedDetails = await Section.findByIdAndUpdate(sectionId,{sectionName},{new : true});

    // return response
    return res.status(StatusCodes.OK).json({
        success : success,
        message : "Section name updated successfully",
    })

    }
    catch(error)
    {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "something went wrong during upf]dation , please try again",
        })
    }

}


exports.deleteSection = async(req,res) =>{
try{
    const {sectionId} = req.params;

    if(!sectionId)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success : false,
            message : "scetionId not present in params"
        })
    }


    await Section.findByIdAndDelete(sectionId);

    return res.status(StatusCodes.OK).json({
        success : true,
        message : "successfully deleted the section"
    })
}
catch(error)
{
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success : false,
        message : "something went wrong, please try again"
    })
}
}




