const Tag = require("../models/tag.js").Tag
const User = require("../models/user.js").User
const Meme = require("../models/meme.js").Meme

// FIND ALL PUBLIC MEMES
module.exports.getAllPublicMemes = function(){
    return new Promise(function(resolve,reject){
        Meme.find({
            privacy:"public"
        }).then((memes)=>{
            resolve(memes)
        }, (err)=>{
            reject(err)
        })
    })
}

// FIND ALL PUBLIC MEMES AND PRIVATE MEMES THAT BELONG TO THE USER
module.exports.getAllMemesByUser = function(user){
    return new Promise(function(resolve,reject){
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
            resolve(memes)
        }, (err)=>{
            reject(err)
        })
    })
}

// SEARCH FOR MEME BASED ON SHARED USERS
module.exports.getAllMemesByUserWithShare = function(user){
    //var n = req.session.meme_count
    return new Promise(function(resolve,reject){
        Meme.find({
            $or:[
                {
                    privacy:"public"
                },
                {
                    privacy:"private",
                    user:user.username
                },
                {
                    privacy:"private",
                    shared_users:{
                        $in:user.username
                    }
                }
            ]
        }).then((memes)=>{
            resolve(memes)
        }, (err)=>{
            reject(err)
        })
    })
}

// FIND MEME BASED ON ID AND RETURN MEME
module.exports.findMeme = function(id){
    return new Promise(function(resolve,reject){
        Meme.findOne({
            _id:id
        }).then((meme)=>{
            resolve(meme)
        }, (err)=>{
            reject(err)
        })
    })
}

// ADD NEW MEME
module.exports.addNewMeme = function(m){
    return new Promise(function(resolve,reject){
        m.save().then((newMeme)=>{
            resolve(newMeme)
        }, (err)=>{
            reject(err)
        })
    })
}

// SEARCH FOR MEME BASED ON TAGS
module.exports.search = function(tags, username){
    return new Promise(function(resolve,reject){
        if (tags){
            Meme.find({
                $or:[
                    {
                        tags: {
                            $all: tags
                        },
                        privacy:"public"
                    },
                    {
                        tags: {
                            $all: tags
                        },
                        privacy:"private",
                        user:username
                    }
                ]
            }).then((memes)=>{
                resolve(memes)
            })
        } else {
            Meme.find({
                $or:[
                    {
                        privacy:"public"
                    },
                    {
                        privacy:"private",
                        user:username
                    }
                ]
            }).then((memes)=>{
                resolve(memes)
            })
        }
    })
}

// DELETE MEME BASED ON ID
module.exports.deleteMeme = function(id){
    return new Promise(function(resolve,reject){
        Meme.deleteOne({
            _id:id
        }).then((result)=>{
            resolve(result)
        })
    })
}

// UPDATE SHARED USERS FOR PARTICULAR MEME BASED ON ID
module.exports.updateSharedUsers = function(id, shared_users){
    return new Promise(function(resolve,reject){
        Meme.findOneAndUpdate({
            _id:id
        }, {
            shared_users:shared_users
        }, {
            returnNewDocument:true
        }).then((newDoc)=>{
            resolve(newDoc)
        },(err)=>{
            reject(err)
        })
    })
}

// EDIT MEME TITLE AND TAGS
module.exports.editMeme = function(id, newTitle, newTags){
    return new Promise(function(resolve,reject){
        Meme.findOneAndUpdate({
            _id:id
        }, {
            title:newTitle,
            tags:newTags
        }, {
            returnNewDocument:true
        }).then((updatedDoc)=>{
            resolve(updatedDoc)
        }, (err)=>{
            reject(err)
        })
    })
}

/*
// FIND ALL PUBLIC MEMES BY COUNT
function getAllPublicMemesByCount(req, res) {
    var n = req.session.meme_count
    Meme.find({
        privacy:"public"
    }).then((memes)=>{
        let user = req.session.user

        memes = memes.slice(0,n)
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

// FIND ALL PUBLIC MEMES AND PRIVATE MEMES THAT BELONG TO THE USER WITH COUNT
function getAllMemesByUserByCount(req,res) {
    var n = req.session.meme_count
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
        memes = memes.slice(0,n)
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
*/