const mongoose = require("mongoose")
const multer = require("multer");

var MemeSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:4,
        trim:true
    },
    user:{
        type:String,
        required:true,
        minlength:4,
        trim:true
    },
    img_path:{
        type: String,
        //contentType: String,
        required: true
    },
    tags:{
        type:Array,
        required:true,
    },
    shared_users:{
        type:Array,
        required:true
    },
    privacy:{
        type:String,
        required:true
    },
    upvotes:{
        type:Number,
        required:true
    },
    downvotes:{
        type:Number,
        required:true
    }
})

var Meme = mongoose.model("meme",MemeSchema)

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./views/static/uploads");
    },
    filename: function (req, file, callback) {
        //callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        callback(null, file.originalname);
    }
})

module.exports = {
    Meme, Storage
}