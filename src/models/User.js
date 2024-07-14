const mongoose = require('mongoose')

const {Enum} = require('../utils/common')

const {ADMIN,STUDENT,INSTRUCTOR} = Enum.accountType
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    firstname : {
        type:String,
        required:true,
        trim:true
    },
    lastname : {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        validate : [
            validateEmail,'Please fill a valid email-address'
        ]
    },
    phoneNumber : {
        type:Number,
        required:true,
    },
    password : {
        type : String,
        required:true
    },
    confirmPassword : {
        type : String,
        required:true
    },
    accountType : {
        type:String,
        enum : [ADMIN,STUDENT,INSTRUCTOR]
    },
    additionalDetails :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Profile'
    },

    // as a student can have multiple course, so courses is array of course where each couse is defined in seperate 'Course model' as referenced.
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Course'
        }
    ],

    resetToken :{
        type:String
    },
    resetPasswordExpires :{
        type:String
    },

    image : {
        type : String,
        required : true
    },

    courseProgress : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'CourseProgress'
        }
    ]


})



userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const saltRounds = parseInt(ServerConfig.SALT_ROUND, 10);
            this.password = await bcrypt.hash(this.password, saltRounds);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next();
    }
});

module.exports = mongoose.model('User',userSchema)