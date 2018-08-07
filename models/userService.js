const User = require("./models/user.js").User

function login(req){
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

function signup(){
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