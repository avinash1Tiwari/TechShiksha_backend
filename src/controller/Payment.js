const { StatusCodes } = require('http-status-codes')
const { instance } = require('../config');
const Course  = require('../models/Course')
const {mailSender} = require('../utils/common')
import User from '../models/User';

// capture the payment and initiate the razorpay order
const capturePayment = async(req,res)=>{



            // get the courseId and userid

            const {course_id} = req.body;
            const userId = req.user.id;
    // valid courseId
     // validation
   
            if(!course_id)
            {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success : true,
                    message : "please provide valid course_id"
                })
            }
            let course;
    try{

           // valid courseDetails
        course = await Course.findById(course_id)

        if(!course)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success:false,
                message : "Could not find the course"
            })
        }

        // user already for the same course

        const uid = new mongoose.Types.objectId(userId)    // converting userId => string to object as userId is as String in Course-model

        if(course.studentEnrolled.includes(uid))
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success:false,
                message : "Student is already enrolled"
            })
        }
    }
    catch(error)
    {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success:false,
            message : "Internal Server error"
        })
    }




    // initiate the payment using razorpay
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount : amount*100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes:{
            courseId : course_id,
            userId
        }
    }

    try{
        const paymentResponse = await instance.create(options)
        console.log(paymentResponse)

        return res.status(StatusCodes.OK).json({
            success:true,
            courseName : course.courseName,
            thumbnail : course.thumbnail,
            orderId : paymentResponse.id,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount,
            message : "Internal Server error"
        })
    }
    catch(error)
    {
        console.log("error during payment initiation ", error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            success:false,
            message : "Could not initiate response"
        })
    }

} 



// verify Signature of Razorpay and server

const verifySignature = async(req,res)=>{
    try{
        const userId = req.user.id;
        
      
        const webHookSecrete = '12345678';

        const signature = req.headers['x-razorpay-signature'];

        const shasum = crypto.createHmac('sha256',webHookSecrete);

        shasum.update(json.stringify(req.body));

        const digest = shasum.digest("hex");

        // matching
        if(signature === digest)
        {


            try{
                console.log("payment is authorised")

                const {courseId,userId} = req.body.payload.payment.entity.notes;

                // fullfill the action
               // find the course and enroll the student in same course
                const enrolledCourse = await Course.findAndUpdate(
                    {id:courseId},
                    {
                        $push : {studentEnrolled:userId}
                    },
                    {new:true}
                )

                if(!enrolledCourse)
                {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success:false,
                        message : "Course not found"
                    })
                }


                // find the student and the course it it's course bucket
                const enrolledStudent = User.findAndUpdate(
                    {_id:userId},
                    {
                        push:{courses : courseId}
                    }
                );

               
                
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congratulations from TechSiksha",
                    "Congratulations , you are onboarding into new TechSiksha course"
                )


                return res.status(StatusCodes.OK).json({
                    success:true,
                    message : "Signature verified and course is added"
                })

                // send mail confirmation wala


            }
            catch(error)
            
            {
                return res.status(StatusCodes.OK).json({
                    success:false,
                    message : "something went wrong"
                })
            }
        }
        else{
            return res.status(StatusCodes.BAD_REQUEST).json({
                success:false,
                message : "Signature not verified, Invalid request "
            })
        }


    }
    catch(error)
    {
        console.log("error during payment initiation ", error)
        return res.status(StatusCodes.BAD_REQUEST).json({
            success:false,
            message : "Could not initiate response"
        })
    }

}



