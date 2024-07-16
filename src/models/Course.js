const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({

    courseName : {
        type : String,
        required : true,
        trim :true
    },
    courseDescription : {
        type : String,
        required : true
    },
    instructor : {
        type : String,
        required : true
    },
    whatYouWillLearn : {
        type : String,
        required : true
    },
    // a courseontent made up of multiple sections and section is having multiple sub-section and subsection contains a video
    courseContent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Section"
        }
    ],
    ratingAndReveiws : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "RatingAndReveiw"
        },
    ],

    thumbnail : {
        type:String
    },
    tags : {
        type:[String]
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    price : {
        type:Number
    },
    studentEnrolled : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }]

})




module.exports = mongoose.model('Course',courseSchema)