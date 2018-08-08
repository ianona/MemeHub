const User = require("./models/user.js").User

// FIND USER BY USERNAME AND PASSWORD
function login(req,res){
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
}

// ADD NEW USER
function signup(req,res){
    console.log("POST /signup")
    let username = req.body.signup_username
    let password = req.body.signup_password
    let email = req.body.signup_email
    let birthday = req.body.signup_month + " " + req.body.signup_day + ", " + req.body.signup_year
    let avatar = req.body.hidden_avatar
    let bio = req.body.signup_bio

    let u = new User({
        username,
        password,
        email,
        birthday,
        avatar,
        bio,
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
}

// ADD MEME TO USER
function addMemeToUser(req,res){
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

    User.findOne({
        username:req.session.user.username
    }).then((user)=>{
        user.memes.push(m)
        user.save()
    })
}

// FIND USER BY ID
function findUserByID(req,res){
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
}

// FIND USER BY USERNAME
function findUserByName(req,res){
    User.findOne({
        username:req.query.name
    }).then((user)=>{
        res.send({
            user
        })
    })
}

// GET ALL USERS EXCEPT CURRENT USER
function getAllUsersExceptCurrent(req,res){
    User.find({
        username: { $ne: req.query.username}
    }).then((users)=>{
        res.send({
            users
        })
    })
}

// FIND USER BASED ON MEME OWNER AND DELETE USERS COPY OF SAID MEME
function deleteUserMeme(req,res){
    var id = req.body.id
    var owner

    Meme.findOne({
        _id:id
    }).then((meme)=>{
        owner = meme.user

        User.findOne({
            username:owner
        }).then((user)=>{
            for(var i = 0; i < user.memes.length; i++) {
                if(user.memes[i]._id == id) {
                    user.memes.splice(i, 1);
                    break;
                }
            }
            user.save().then(()=>{
                res.redirect('/')
            })
        })
    })    
}