const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    timeDuration : {
        type : String
    },
    description : {
        type : String
    },
    videoUrl : {
        type : String
    }
})


module.exports = mongoose.model('Course',CourseSchema)