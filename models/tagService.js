const Tag = require("../models/tag.js").Tag
const User = require("../models/user.js").User
const Meme = require("../models/meme.js").Meme

// GET ALL TAGS
module.exports.getAllTags = function () {
    return new Promise(function (resolve, reject) {
        Tag.find({

        }).then((tags) => {
            resolve(tags)
        })
    })
}

// GET TOP 5 POPULAR TAGS BASED ON NUMBER OF POSTS
module.exports.getPopularTags = function () {
    return new Promise(function (resolve, reject) {
        Tag.find({

        }).then((tags) => {
            var i
            var top5 = []

            //sorting tags array by  number of posts per tag in descending order
            tags.sort((a, b) => parseFloat(b.posts.length) - parseFloat(a.posts.length))

            for (i = 0; i < 5; i++) {
                if (tags[i] != null)
                    top5.push(tags[i])
            }


            resolve(top5)
        })
    })
}

function contains(list, element){
    for(i=0;i<list.length;i++){
        if(list[i]._id == element._id)
            return i
    }
    return -1
}

// ADD TAGS FROM AN ARRAY OF TAGS
module.exports.addTag = function (name, m) {
    return new Promise(function (resolve, reject) {
        Tag.findOne({
            name: name
        }).then((tag) => {
            if (tag) {
                if (contains(tags.posts, m) != -1){
                    tags.posts.splice(contains(tags.posts, m),1)
                }
                tag.posts.push(m)
                tag.save().then((newdoc) => {
                    resolve(newdoc)
                }, (err) => {
                    reject(err)
                })
            } else {
                var t = new Tag({
                    name: name,
                    posts: [m]
                })

                t.save().then((newdoc) => {
                    resolve(newdoc)
                }, (err) => {
                    reject(err)
                })
            }
        })
    })
}

// FIND TAG BASED ON MEME ID AND DELETE MEME WITHIN TAG
module.exports.deleteTagMeme = function (meme) {
    return new Promise(function (resolve, reject) {
        Tag.find({
            //posts.id: id
        }).then((tags) => {
            for (i = tags.length - 1; i > -1; i--) {
                tags[i].posts.splice(tags[i].posts.indexOf(meme), 1);
                tags[i].save()
            }

            resolve(tags)
        })
    })
}

// REMOVE TAG BASED ON NAME
module.exports.removeTags = function(name){
    return new Promise(function (resolve, reject) {
        Tag.remove({
            name : name
        }).then((result)=>{
            resolve(result)
        },(err)=>{
            reject(err)
        })
    })
}

/*


// SEARCH FOR POSTS BASED ON TAG NAME
function searchByTag(req, res){
    var name = req.body.name
    var posts = req.body.posts

    Tag.find({
        name : name
    }).then((tag)=>{
        res.render("index.hbs", {
            tag.posts
        })
    })

}

// UPDATE MEME TITLE AND TAGS WITHIN TAGS
function findMemeTagAndUpdate(req,res){
    User.find({
        memes._id:req.query.id
    }).then((tags)=>{
        for (i=0;i<tags.length;i++){
            for (j=0;j<tags[i].posts[j].length;j++) {
                if (tags[i].posts[j]._id==req.query.id){
                    tags[i].posts[j].tags = req.query.new_tags
                    tags[i].posts[j].title = req.query.new_title
                    tags[i].posts[j].save()
                }
            }
        }

        res.send({
            msg:"success"
        })
    })
}

// UPDATE MEME SHARED USERS WITHIN TAG
function findMemeTagAndUpdateSharedUsers(req,res){
    Tag.find({
        posts._id:req.query.id
    }).then((tags)=>{
        for (i=0;i<tags.length;i++){
            for (j=0;j<tags[i].posts[j].length;j++) {
                if (tags[i].posts[j]._id==req.query.id){
                    tags[i].posts[j].upvotes = req.query.shared_users
                    tags[i].posts[j].save()
                }
            }
        }
        res.send({
            msg:"success"
        })
    })
}

// UPDATE MEME COUNT WITHIN TAG
function findMemeTagAndUpdateCount(req,res){
    Tag.find({
        posts._id:req.body.id
    }).then((tags)=>{
        for (i=0;i<tags.length;i++){
            for (j=0;j<tags[i].posts[j].length;j++) {
                if (tags[i].posts[j]._id==req.body.id){
                    tags[i].posts[j].upvotes = req.body.upvotes
                    tags[i].posts[j].downvotes = req.body.downvotes
                    tags[i].posts[j].save()
                }
            }
        }
        res.send({
            up:req.body.upvotes,
            down:req.body.downvotes
        })

    })
}
*/