const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const session= require("express-session")
const cookieparser = require("cookie-parser")
const TagService = require("../models/tagService")

/*                  SETUP               */
const app = express()
const urlencoder = bodyparser.urlencoded({
    extended: false
})
app.use(cookieparser())

// AJAX ROUTE TO UPDATE SEARCH TAGS BOX
// FIND ALL TAGS
router.get("/getTags", (req,res)=>{
    TagService.getAllTags().then((tags)=>{
        res.send({
            tags
        })
    })
})

// AJAX ROUTE TO UPDATE POPULAR TAGS BOX
// GET TOP 5 POPULAR TAGS BASED ON NUMBER OF POSTS
router.get("/getPopularTags", (req,res)=>{
    TagService.getPopularTags().then((tags)=>{
        res.send({
            tags
        })
    })
})

module.exports = router