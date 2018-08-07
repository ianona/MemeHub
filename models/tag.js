const mongoose = require("mongoose")

var TagSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    posts:{
        type:Array,
        required:true
    }
})

var Tag = mongoose.model("tag",TagSchema)

module.exports = {
    Tag
}