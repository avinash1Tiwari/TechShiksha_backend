const mongoose = require('mongoose')

const RatingAndReveiwSchema = new mongoose.Schema({

    user :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    rating : {
        type : Number,
        required : true
    },
    reveiw : {
        type :String,
        required : true
    }
})


module.exports = mongoose.model('RatingAndReveiw',RatingAndReveiwSchema)