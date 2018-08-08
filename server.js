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

// HBS HELPER TO CHECK FOR EQUALITY
hbs.registerHelper("equal", (n,a)=>{
    return n==a;
})

// HBS HELPER TO CHECK FOR PRIVACY
hbs.registerHelper("isPrivate", (n)=>{
    return n=="private";
})

// HBS HELPER TO CHECK IF PUBLIC
hbs.registerHelper("isPublic", (n)=>{
    return n=="public";
})

/*                  ROUTES               */
// GENERIC ROUTE
app.use("/",(req,res,next)=>{
    next();
})

// SORTING FUNCTIONS, DEFAULT IS TOP
function top(a,b){
    if (a._id < b._id)
        return 1
    return -1
}

function hot(a,b){
    if (a.upvotes < b.upvotes)
        return 1
    return -1
}

function trending(a,b){
    if (a.tags.length < b.tags.length)
        return 1
    return -1
}

var curSort = top 

// ROUTE FOR HOME PAGE (NOT LOGGED IN)
// GET ALL PUBLIC MEMES
app.get("/",(req,res)=>{
    console.log("GET /")
    Meme.find({
        privacy:"public"
    }).then((memes)=>{
        let user = req.session.user
        memes.sort(curSort)
        if (user){
            res.redirect(307,"/login_success")
        } else {
            res.render("index.hbs",{
                memes
            })
        }
    }, ()=>{
        res.render("error.hbs")
    })
})

// ROUTE FOR HOME PAGE (LOGGED IN)
// GET ALL PUBLIC MEMES OR PRIVATE MEMES THE USER OWNS
app.get("/login_success", (req,res)=>{
    console.log("POST /login_success")
    let user = req.session.user
    Meme.find({
        $or:[
            {
                privacy:"public"
            },
            {
                privacy:"private",
                user:user.username
            }
        ]
    }).then((memes)=>{
        memes.sort(curSort)
        res.render("index.hbs",{
            user,
            memes
        })
    })
})

// ROUTE FOR SIGNING UP
// ADD NEW USER
app.post("/signup", urlencoder, (req,res)=>{
    console.log("POST /signup")
    let username = req.body.signup_username
    let password = req.body.signup_password
    let email = req.body.signup_email
    let birthday = req.body.signup_month + " " + req.body.signup_day + ", " + req.body.signup_year
    let avatar = req.body.hidden_avatar
    let bio = req.body.signup_bio

    let u = new User({
        username, password, email, birthday, avatar, bio,
        join_date:new Date(),
        memes:[]
    })

    u.save().then(()=>{
        Meme.find({
            privacy:"public"
        }).then((memes)=>{
            memes.sort(curSort)
            res.render("index.hbs",{
                memes,
                signup_message:"You have successfully registered for a MemeHub account!"
            })
        })
    }, (err)=>{
        Meme.find({
            privacy:"public"
        }).then((memes)=>{
            memes.sort(curSort)
            res.render("index.hbs",{
                memes,
                signup_message:"Sorry, something went wrong: ",
                error:err
            })
        })
    })
})

// ROUTE FOR FINISHING UPLOAD
// ADD NEW MEME
// LOOP THROUGH TAGS AND ADD NEW ONES
// ADD NEW MEME UNDER USER
app.post("/finishUpload", urlencoder, (req, res) => {
    console.log("POST /finishUpload")

    var m = new Meme({
        title:req.body.title,
        user:req.session.user.username,
        img_path:"uploads/"+req.body.hiddenFile,
        tags:req.body.tags.split(' ').filter(Boolean),
        shared_users:req.body.shared_users,
        privacy:req.body.status,
        upvotes:0,
        downvotes:0
    })

    for (i=0;i<req.body.tags.split(' ').filter(Boolean).length;i++){
        let name = req.body.tags.split(' ').filter(Boolean)[i]
        Tag.findOne({
            name: name
        }).then((tag)=>{
            if(tag){
                console.log("Tag already exists")
            } else{
                var t = new Tag({
                    name:name,
                    posts:[m]
                })    

                t.save().then((newdoc)=>{
                    console.log("successfully added tag")
                }, (err)=>{
                    console.log("something went wrong: "+err)
                })
            }
        })
    }

    m.save().then(()=>{
        console.log("[Meme] SAVE SUCCESS!")
    }, (err)=>{
        console.log("[Meme] SAVE FAILURE: " + err)
    })

    User.findOne({
        username:req.session.user.username
    }).then((user)=>{
        user.memes.push(m)
        user.save()
    })

    res.redirect("/")
})


// ROUTE FOR SORTING
// JUST CHANGE SORT TYPE AND REDIRECT
app.post('/sort', urlencoder, (req,res)=>{
    console.log(req.body.sort_type)
    switch (req.body.sort_type) {
        case 'top':
            curSort = top
            break
            case 'hot':
            curSort = hot
            break
            case 'trending':
            curSort = trending
            break
    }
    res.redirect('/')
})

// ROUTE FOR LOADING PROFILE
// FIND USER BY ID
app.get("/profile", urlencoder, (req,res)=>{
    console.log("GET /profile")
    let id = req.query.profileID
    User.findOne({
        _id:id
    }).then((profile)=>{
        let user = req.session.user
        console.log(profile)
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

// ROUTE FOR WHEN USER DELETES MEME
// DELETE MEME
// DELETE USERS COPY OF MEME
// REDIRECT TO /
app.post('/deleteMeme', urlencoder,(req,res)=>{
    console.log("POST /deleteMeme")
    var id = req.body.id
    var owner

    Meme.findOne({
        _id:id
    }).then((meme)=>{
        owner = meme.user
        console.log(owner)
        Meme.deleteOne({
            _id:id
        }).then((result)=>{
            console.log("[Meme] Delete Success!")
            User.findOne({
                username:owner
            }).then((user)=>{
                for(var i = 0; i < user.memes.length; i++) {
                    if(user.memes[i]._id == id) {
                        user.memes.splice(i, 1);
                        break;
                    }
                }
                user.save()
            })
        })
    })

    res.redirect('/')
})

// LOGOUT & END CURRENT SESSION
app.get("/logout", (req,res)=>{
    console.log("GET /logout")
    req.session.destroy()
    res.redirect("/")
})

/*                  AJAX ROUTES               */

// AJAX ROUTE TO CHECK CREDENTIALS
// FIND USER BASED FROM USERNAME & PASSWORD
app.post("/login", urlencoder, (req,res)=>{
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

// AJAX ROUTE WHEN LOADING VIEW MEME MODAL
// FIND MEME BASED ON ID
app.post("/viewMeme", urlencoder, (req,res)=>{
    Meme.findOne({
        _id:req.body.id
    }).then((meme)=>{
        res.send({
            meme
        })
    })
})

// AJAX ROUTE WHEN LOADING VIEW USER MODAL
// FIND USER BASED ON USERNAME
app.get("/viewUser", urlencoder, (req,res)=>{
    User.findOne({
        username:req.query.name
    }).then((user)=>{
        res.send({
            user
        })
    })
})

// AJAX ROUTE TO UPLOAD FILE
app.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
})

// AJAX ROUTE TO UPDATE SEARCH TAGS BOX
// FIND ALL TAGS
app.get("/getTags", (req,res)=>{
    Tag.find({

    }).then((tags)=>{
        res.send({
            tags
        })
    })
})

// AJAX ROUTE USED TO UPDATE SHARE USERS BOX/ES
// GET ALL USERS EXCEPT FOR THE CURRENT USER
app.get("/getUsers", (req,res)=>{
    User.find({
        username: { $ne: req.query.username}
    }).then((users)=>{
        res.send({
            users
        })
    })
})

// AJAX ROUTE TO UPDATE POPULAR TAGS BOX
// GET TOP 5 POPULAR TAGS BASED ON NUMBER OF POSTS
app.get("/getPopularTags", (req,res)=>{
    Tag.find({

    }).then((tags)=>{
        var i
        var top5 = []

        //sorting tags array by  number of posts per tag in descending order
        tags.sort((a, b) => parseFloat(b.posts.length) - parseFloat(a.posts.length))

        for(i = 0; i < 5; i++)
        {
            top5.push(tags[i])
        }

        res.send({
            top5
        })
    })
})

// AJAX ROUTE USED WHEN EDITING MEMES
// FIND MEME BY ID AND UPDATE NAME AND TAGS
app.get('/editMeme', urlencoder, (req,res)=>{
    Meme.findOneAndUpdate({
        _id:req.query.id
    }, {
        title:req.query.new_title,
        tags:req.query.new_tags
    }).then(()=>{
        res.send({
            msg:"success"
        })
    })
})

// AJAX ROUTE USED WHEN USER CLICKS ON UPVOTE/DOWNVOTE
// UPDATE MEME BASED ON ID TO NEW UPVOTE/DOWNVOTE NUMBER
// UPDATE USERS COPY OF MEME ALSO :0
app.post('/updateVotes', urlencoder, (req,res)=>{
    Meme.update(
        { _id: req.body.id },
        { $set:
         {
             upvotes:req.body.upvotes,
             downvotes:req.body.downvotes
         }
        }
    ).then(()=>{
        res.send({
            up:req.body.upvotes,
            down:req.body.downvotes
        })
    })
})

// AJAX ROUTE USED WHEN USER EDITS SHARED USERS FOR OWNED MEME
// UPDATE SHARED USERS ARRAY FOR MEME
app.post('/updateSharedUsers', urlencoder, (req,res)=>{
    console.log(req.body.shared_users2)
    console.log(req.body.id)
    Meme.findOneAndUpdate({
        _id:req.body.id
    }, {
        shared_users:req.body.su
    }).then(()=>{
        res.send({
            msg:"success"
        })
    })
})

// AJAX ROUTE USED FOR SEARCH
// FIND MEMES CONTAINING PARTICULAR TAGS
app.get('/search', urlencoder, (req,res)=>{
    if (req.query.tags){
        var uname = ""
        if (req.session.user)
            uname = req.session.user.username
        Meme.find({
            $or:[
                {
                    tags: {
                        $all: req.query.tags
                    },
                    privacy:"public"
                },
                {
                    tags: {
                        $all: req.query.tags
                    },
                    privacy:"private",
                    user:uname
                }
            ]

        }).then((memes)=>{
            console.log("[Meme] Search success!")
            res.send({memes})
        })
    } else {
        var uname = ""
        if (req.session.user)
            uname = req.session.user.username
        Meme.find({
            $or:[
                {
                    privacy:"public"
                },
                {
                    privacy:"private",
                    user:uname
                }
            ]
        }).then((memes)=>{
            console.log("[Meme] Search success!")
            res.send({memes})
        })
    }
})

// AJAX ROUTE TO GET CURRENT SORT USED AND UPDATE NAVBAR
app.get('/getSort', (req,res)=>{
    if (curSort === hot)
        res.send({result:"hot"})
    if (curSort === top)
        res.send({result:"top"})
    if (curSort === trending)
        res.send({result:"trending"})
})

// SETUP STATIC FILES
app.use(express.static(path.join(__dirname, "views/static")))

// HARDCODED DATABASE FUNCTIONS
function clearDB(){
    Meme.remove({}).then((result)=>{
        console.log("[Meme] CLEAR SUCCESS")
    })

    Tag.remove({}).then((result)=>{
        console.log("[Tag] CLEAR SUCCESS")
    })

    User.remove({}).then((result)=>{
        console.log("[User] CLEAR SUCCESS")
    })
}

function addDummyValues(){
    let m = new Meme({
        title:"sample meme",
        user:"superman",
        img_path:"uploads/first.png",
        tags:["first","meme"],
        shared_users:["angelo","zachary","sampleaccount"],
        privacy:"public",
        upvotes:0,
        downvotes:0
    })

    m.save().then(()=>{
        console.log("[Meme] SAVE SUCCESS!")
    }, (err)=>{
        console.log("[Meme] SAVE FAILURE: " + err)
    })

    let t = new Tag({
        name:"dank",
        posts:[]
    })

    t.save().then(()=>{
        console.log("[Tag] SAVE SUCCESS!")
    }, (err)=>{
        console.log("[Tag] SAVE FAILURE: " + err)
    })
}

app.listen(3000, ()=>{
    //clearDB()
    //addDummyValues()
    console.log("Now listening on port 3000...")
})