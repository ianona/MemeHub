const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const session= require("express-session")
const cookieparser = require("cookie-parser")
const MemeService = require("../models/memeService")
const UserService = require("../models/userService")
const fs = require("fs")
const path = require("path")

/*                  SETUP               */
const app = express()
const urlencoder = bodyparser.urlencoded({
    extended: false
})
app.use(cookieparser())

router.use("/user", require("./user"))
router.use("/meme", require("./meme"))
router.use("/tag", require("./tag"))

// SORTING FUNCTIONS, DEFAULT IS TOP
function recent(a,b){
    if (a._id < b._id)
        return 1
    return -1
}

/*
function hot(a,b){
    if (a.upvotes < b.upvotes)
        return 1
    return -1
}
*/

function trending(a,b){
    if ((a.tags.length + a.shared_users.length) < (b.tags.length + b.shared_users.length))
        return 1
    return -1
}

global.curSort = recent

// GET ALL PUBLIC MEMES
router.get("/",(req,res)=>{
    console.log("GET /")
    let user = req.session.user
    
    if (user)
        res.redirect(307,"../login_success")

    if (req.session.meme_count == null)
        req.session.meme_count = 5
    let count = req.session.meme_count

    MemeService.getAllPublicMemes(count).then((memes)=>{
        memes.sort(curSort)
        memes = memes.slice(0,count)
        res.render("index.hbs", {
            memes
        })
    })
})

// ROUTE FOR HOME PAGE (LOGGED IN)
// GET ALL PUBLIC MEMES OR PRIVATE MEMES THE USER OWNS
router.get("/login_success", (req,res)=>{
    console.log("GET /login_success")

    let count = req.session.meme_count
    UserService.findUserByID(req.session.user._id).then((user)=>{
        MemeService.getAllMemesByUserWithShare(user).then((memes)=>{
            memes.sort(curSort)
            memes = memes.slice(0,count)
            
            res.render("index.hbs",{
                user,
                memes
            })
        })
    })
})

// ROUTE FOR SORTING
// JUST CHANGE SORT TYPE AND REDIRECT
router.post('/sort', urlencoder, (req,res)=>{
    console.log("GET /sort")
    switch (req.body.sort_type) {
        case 'recent':
            curSort = recent
            break
        /*
        case 'hot':
            curSort = hot
            break
        */
        case 'trending':
            curSort = trending
            break
    }
    res.redirect('/')
})

router.get("/more",(req,res)=>{
    req.session.meme_count += 5
    let count = req.session.meme_count
    if (req.session.user){
        UserService.findUserByID(req.session.user._id).then((user)=>{
            MemeService.getAllMemesByUserWithShare(user,count).then((memes)=>{
                memes.sort(curSort)
                memes = memes.slice(count-5,count)
                res.send({memes})
            })
        })
    } else {
        MemeService.getAllPublicMemes(count).then((memes)=>{
            memes.sort(curSort)
            memes = memes.slice(count-5,count)
            res.send({memes})
        })
    }
})

// LOGOUT & END CURRENT SESSION
router.get("/logout", (req,res)=>{
    console.log("GET /logout")
    req.session.destroy()
    res.redirect("/")
})

// AJAX ROUTE TO GET CURRENT SORT USED AND UPDATE NAVBAR
router.get('/getSort', (req,res)=>{
    if (curSort === recent)
        res.send({result:"recent"})
    /*
    if (curSort === top)
        res.send({result:"top"})
    */
    if (curSort === trending)
        res.send({result:"trending"})
})

module.exports = router
