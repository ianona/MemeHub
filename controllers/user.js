const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const session= require("express-session")
const cookieparser = require("cookie-parser")
const crypto = require('crypto')
const UserService = require("../models/userService")
const MemeService = require("../models/memeService")
const User = require("../models/user.js").User

/*                  SETUP               */
const app = express()
const urlencoder = bodyparser.urlencoded({
    extended: false
})
app.use(cookieparser())

// ROUTE FOR SIGNING UP
// ADD NEW USER
router.post("/signup", urlencoder, (req,res)=>{
    console.log("POST user/signup")
    let username = req.body.signup_username
    let password = crypto.createHash('md5').update(req.body.signup_password).digest("hex")
    let email = req.body.signup_email
    let birthday = req.body.signup_month + " " + req.body.signup_day + ", " + req.body.signup_year
    let avatar = req.body.hidden_avatar
    let bio = req.body.signup_bio

    let u = new User({
        username, password, email, birthday, avatar, bio,
        join_date:new Date(),
        memes:[]
    })

    UserService.signup(u).then((user)=>{
        console.log("[User] Successfully registered " + user)
        MemeService.getAllPublicMemes().then((memes)=>{
            //memes.sort(curSort)
            res.render("index.hbs",{
                memes,
                signup_message:"You have successfully registered for a MemeHub account!"
            })
        })
    }, (err)=>{
        MemeService.getAllPublicMemes().then((memes)=>{
            //memes.sort(curSort)
            res.render("index.hbs",{
                memes,
                signup_message:"Sorry, something went wrong: ",
                error:err
            })
        })
    })
})

// ROUTE FOR LOADING PROFILE
// FIND USER BY ID
router.get("/profile", urlencoder, (req,res)=>{
    console.log("GET user/profile")
    let id = req.query.profileID
    UserService.findUserByID(id).then((profile)=>{
        let user = req.session.user
        if (user) {
            res.render("profile.hbs", {
                user,
                profile
            })
        } else {
            res.render("profile.hbs", {
                profile
            })
        }
    })
})

// AJAX ROUTE TO CHECK CREDENTIALS
// FIND USER BASED FROM USERNAME & PASSWORD
router.post("/login", urlencoder, (req,res)=>{
    UserService.login(req.body.username,req.body.password).then((user)=>{
        if (user) {
            req.session.user = user
            res.send({
                result:"success"
            })
        }
        else {
            res.send({
                result:"error"
            })
        }
    })
})

// AJAX ROUTE WHEN LOADING VIEW USER MODAL
// FIND USER BASED ON USERNAME
router.get("/viewUser", urlencoder, (req,res)=>{
    UserService.findUserByName(req.query.name).then((user)=>{
        res.send({
            user
        })
    })
})

// AJAX ROUTE USED TO UPDATE SHARE USERS BOX/ES
// GET ALL USERS EXCEPT FOR THE CURRENT USER
router.get("/getUsers", (req,res)=>{
    UserService.getAllUsersExceptCurrent(req.query.username).then((users)=>{
        res.send({
            users
        })
    })
})

module.exports = router