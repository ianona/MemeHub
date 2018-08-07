const express = require("express")
const path = require("path")
const bodyparser = require("body-parser")
const session= require("express-session")
const cookieparser = require("cookie-parser")
const hbs = require("hbs")
const mongoose = require("mongoose")
const fs = require("fs")
const multer = require("multer")
const User = require("./models/user.js").User
const Storage = require("./models/meme.js").Storage
const upload = multer({ storage: Storage }).array("imgUploader")
const Meme = require("./models/meme.js").Meme
const Tag = require("./models/tag.js").Tag

/*                  SETUP               */
var app = express()
app.set("view engine", "hbs")
hbs.registerPartials(__dirname+"/views/partials")
const urlencoder = bodyparser.urlencoded({
    extended: false
})
app.use(cookieparser())
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/MP2",{
    useNewUrlParser:true
})
app.use(express.static(__dirname+"/views/static"))
app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:"supersecrethash",
    name:"MP_Phase2",
    // 1 hour sessions
    cookie:{
        maxAge:1000*60*60
    }
}))

/*                  ROUTES               */
app.use("/",(req,res,next)=>{
    next();
})

app.get("/",(req,res)=>{
    Meme.find({
        privacy:"public"
    }).then((memes)=>{
        let user = req.session.user
        if (user){
            res.redirect("/login_success")
        } else {
            res.render("index.hbs",{
                memes
            })
        }
    }, ()=>{
        res.render("error.hbs")
    })
})

app.post("/login", urlencoder, (req,res)=>{
    console.log("USER: " + req.body.username+"/"+req.body.password)

    User.findOne({
        username:req.body.username,
        password:req.body.password
    }).then((user)=>{
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

app.post("/viewMeme", urlencoder, (req,res)=>{
    Meme.findOne({
        _id:req.body.id
    }).then((meme)=>{
        res.send({
            meme
        })
    })
})

app.get("/login_success", urlencoder, (req,res)=>{
    let user = req.session.user
    Meme.find({
        privacy:"public"
    }).then((memes)=>{
        res.render("index.hbs",{
            user,
            memes
        })
    }, ()=>{
        res.render("error.hbs")
    })
})

app.post("/signup", urlencoder, (req,res)=>{
    let username = req.body.signup_username
    let password = req.body.signup_password
    let email = req.body.signup_email
    let birthday = req.body.signup_month + " " + req.body.signup_day + ", " + req.body.signup_year
    let avatar = req.body.hidden_avatar
    let bio = req.body.signup_bio
    console.log(username+"/"+password)
    let u = new User({
        username, password, email, birthday, avatar, bio,
        join_date:new Date(),
        memes:[]
    })

    u.save().then(()=>{
        res.render("index.hbs", {
            signup_message:"You have successfully registered for a MemeHub account!"
        })
    }, (err)=>{
        res.render("index.hbs", {
            signup_message:"Sorry, something went wrong: ",
            error:err
        })
    })
})

app.post("/upload", urlencoder, (req, res) => {
    upload(req, res, function (err) {
        let user = req.session.user
        if (err) {
            Meme.find({
                privacy:"public"
            }).then((memes)=>{
                res.render("index.hbs", {
                    upload_message:"Sorry, something went wrong with the upload: ",
                    error:err,
                    user,
                    memes
                })
            }, ()=>{
                res.render("error.hbs")
            })
        }
        Meme.find({
            privacy:"public"
        }).then((memes)=>{
            res.render("index.hbs", {
                upload_message:"You have successfully uploaded a meme!",
                user,
                memes
            })
        }, ()=>{
            res.render("error.hbs")
        })
    })
})

app.get("/logout", (req,res)=>{
    req.session.destroy()
    res.redirect("/")
})

app.use(express.static(path.join(__dirname, "views/static")))
app.listen(3000, ()=>{
    // clear memes
    Meme.remove({}).then((result)=>{
        console.log("[Meme] CLEAR SUCCESS")
    })

    let m = new Meme({
        title:"sample meme",
        user:"admin",
        img_path:"uploads/first.png",
        tags:["first","meme"],
        shared_users:["admin2"],
        privacy:"public",
        upvotes:0,
        downvotes:0
    })

    m.save().then(()=>{
        console.log("[Meme] SAVE SUCCESS!")
    }, (err)=>{
        console.log("[Meme] SAVE FAILURE: " + err)
    })

    console.log("Now listening on port 3000...")
})