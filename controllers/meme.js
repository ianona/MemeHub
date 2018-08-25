const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const Storage = require("../models/meme.js").Storage
const multer = require("multer")
const upload = multer({ storage: Storage }).array("imgUploader")
const MemeService = require("../models/memeService")
const TagService = require("../models/tagService")
const UserService = require("../models/userService")
const Meme = require("../models/meme.js").Meme
const fs = require("fs")
const path = require("path")

/*                  SETUP               */
const app = express()
const urlencoder = bodyparser.urlencoded({
    extended: false
})
app.use(cookieparser())

// ROUTE FOR FINISHING UPLOAD
// LOOP THROUGH TAGS AND ADD NEW ONES
// ADD NEW MEME UNDER USER
// ADD NEW MEME
router.post("/finishUpload", urlencoder, (req, res) => {
    console.log("POST meme/finishUpload")

    var m = new Meme({
        title: req.body.title,
        user: req.session.user.username,
        img_path: "uploads/" + req.body.hiddenFile,
        tags: req.body.tags_upload.split(' ').filter(Boolean),
        shared_users: req.body.share_upload.split(' ').filter(Boolean),
        privacy: req.body.status,
        upvotes: 0,
        downvotes: 0
    })
    
    let tags = req.body.tags_upload.split(' ').filter(Boolean)
    for (i = 0; i < tags.length; i++) {
        TagService.addTag(tags[i], m).then((tag) => {
            console.log("[Tag] Successfully added: " + tag)
        }, (err) => {
            console.log("[Tag] Something went wrong:  " + err)
        })
    }

    UserService.addMemeToUser(req.session.user.username, m).then((user) => {
        console.log("[User] Added meme to user: " + user)
    }, (err) => {
        console.log("[User] Something went wrong:  " + err)
    })

    MemeService.addNewMeme(m).then((meme) => {
        MemeService.getAllMemesByUser(req.session.user).then((memes) => {
            res.render("index.hbs", {
                user: req.session.user,
                memes,
                upload_message: "You have successfully uploaded a meme!"
            })
        })
    }, (err) => {
        console.log("[Meme] Save failure: " + err)
    })
    
})

// ROUTE FOR WHEN USER DELETES MEME
// DELETE MEME
// DELETE USERS COPY OF MEME
// ***** DELETE TAG COPY OF MEME
router.post('/deleteMeme', urlencoder, (req, res) => {
    console.log("POST meme/deleteMeme")

    MemeService.findMeme(req.body.id).then((meme) => {
        var owner = meme.user
        MemeService.deleteMeme(req.body.id).then((result) => {
            console.log("[Meme] Delete Success!")
            TagService.deleteTagMeme(req.body.id).then((tags)=>{
                console.log("[Tag] Successfully removed meme from tag")
                UserService.deleteUserMeme(owner, req.body.id).then((newUser) => {
                    res.redirect("../")
                })
            })
        })
    })
})

// AJAX ROUTE WHEN LOADING VIEW MEME MODAL
// FIND MEME BASED ON ID
router.post("/viewMeme", urlencoder, (req, res) => {
    MemeService.findMeme(req.body.id).then((meme) => {
        res.send({
            meme
        })
    })
})

// AJAX ROUTE TO UPLOAD FILE
router.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!");
    });
})

// AJAX ROUTE USED FOR SEARCH
// FIND MEMES CONTAINING PARTICULAR TAGS
router.get('/search', urlencoder, (req, res) => {
    var uname = ""
    if (req.session.user)
        uname = req.session.user.username

    MemeService.search(req.query.tags, uname).then((memes) => {
        console.log("[Meme] Search success!")
        res.send({ memes })
    })
})

// AJAX ROUTE USED WHEN USER EDITS SHARED USERS FOR OWNED MEME
// UPDATE SHARED USERS ARRAY FOR MEME
router.get('/updateSharedUsers', urlencoder, (req,res)=>{
    MemeService.updateSharedUsers(req.query.id,req.query.shared_users).then((updatedDoc)=>{
        res.send({
            updatedDoc
        })
    })
})

// AJAX ROUTE USED WHEN EDITING MEMES
// FIND MEME BY ID AND UPDATE NAME AND TAGS
router.get('/editMeme', urlencoder, (req,res)=>{
    let id = req.query.id
    let newTitle = req.query.new_title
    let newTags = req.query.new_tags
    MemeService.editMeme(id,newTitle,newTags).then((updatedDoc)=>{
        for(i=0;i<newTags.length;i++){
            TagService.addTag(newTags[i], updatedDoc).then((tag) => {
                console.log("[Tag] Successfully edited: " + tag)
            }, (err) => {
                console.log("[Tag] Something went wrong:  " + err)
            })
        }

        res.send({
            msg:"success"
        })
    })
})

// ROUTE FOR CREATING FILE STREAM
router.get("/photo/:id", (req, res) => {
    MemeService.findMeme(req.params.id).then((meme) => {
        fs.createReadStream(path.resolve(meme.img_path)).pipe(res)
    })
})

module.exports = router