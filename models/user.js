const mongoose = require("mongoose")

var UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:4,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    birthday:{
        type:Date,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        maxlength:200
    },
    join_date:{
        type:Date,
        required:true
    }
})

var User = mongoose.model("user",UserSchema)

module.exports = {
    User
}