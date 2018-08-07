const Meme = require("./models/meme.js").Meme

function getAllPublicMemes(req) {
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
}

function getAllMemesByUser(u) {
    Meme.find({
        $or:[
            {
                privacy:"public"
            },
            {
                privacy:"private",
                user:u.username
            }
        ]
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
}