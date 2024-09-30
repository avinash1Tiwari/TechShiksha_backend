
const {StatusCodes} = require('http-status-codes');
const SubSection = require('../models/SubSection');
const Course = require('../models/Course');
const Section = require('../models/Section');
const ServerConfig = require('../config/server-config')
const { uploadImageToCloudinary } = require('../utils/common/imgaeUploader');
const createSubSection = async(req,res)=>{
    try{
        // 1. fetch the data
        // 2. extract the file/url
        // 3 . uploade video to to cloudinary and in response you will get a secure url from cloudinary
        // 4 . create subsection

        const {courseId,sectionId,title,timeDuration,description} = req.body;
        const video = req.file.videoFile;

        if(!courseId || !sectionId || !title || !timeDuration || !description || !videoUrl)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success : false,
                message : "All fields are required"
            })
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,ServerConfig.FOLDER_NAME)

        const newsubsection = await SubSection.create({
            title : title,
            timeDuration:timeDuration,
            videoUrl:uploadDetails.secure_url,
            description:description
        })


       // adding a subSection in the section
        const updatedSection = await Section.findByIdAndUpdate(
            {_id : sectionId},
            {
                $push : {
                    subSections : newsubsection._id
                }
            },
            {new:true}

        ).populate('subSections');

        //log updated section here after adding populate method

        return res.status(StatusCodes.OK).json({
            success : true,
            message : "subsection added successfully",
        })
    }
    catch(error)
    {
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "something went wrong",
        })
    }
}