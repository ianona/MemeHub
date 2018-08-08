const Meme = require("./models/meme.js").Meme

// FIND ALL PUBLIC MEMES
function getAllPublicMemes(req, res) {
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

// FIND ALL PUBLIC MEMES AND PRIVATE MEMES THAT BELONG TO THE USER
function getAllMemesByUser(req,res) {
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
        let user = req.session.user
        if (user){
            res.redirect("/login_success")
        } else {
            res.render("index.hbs",{
                memes
            })
        }
    })
}

// ADD NEW MEME
function addNewMeme(req,res){
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

    m.save().then(()=>{
        console.log("[Meme] SAVE SUCCESS!")
    }, (err)=>{
        console.log("[Meme] SAVE FAILURE: " + err)
    })

    res.redirect("/")
}

// DELETE MEME
function deleteMeme(req,res){
    var id = req.body.id
    Meme.deleteOne({
        _id:id
    }).then((result)=>{
        console.log("[Meme] Delete Success!")
        res.redirect('/')
    })
}

// FIND MEME BASED ON ID AND RETURN MEME
function findMeme(req,res){
    Meme.findOne({
        _id:req.body.id
    }).then((meme)=>{
        res.send({
            meme
        })
    })
}

// UPDATE MEME BASED ON ID TO NEW UPVOTE/DOWNVOTE NUMBER
function updateVotes(req,res){
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
}

// UPDATE SHARED USERS FOR PARTICULAR MEME BASED ON ID
function updateSharedUsers(req,res){
    Meme.findOneAndUpdate({
        _id:req.body.id
    }, {
        shared_users:req.body.su
    }).then(()=>{
        res.send({
            msg:"success"
        })
    })
}

// SEARCH FOR MEME BASED ON TAGS
function search(req,res){
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
}

// EDIT MEME TITLE AND TAGS
function editMeme(req,res){
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
}