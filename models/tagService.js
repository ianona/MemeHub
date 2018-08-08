const Tag = require("./models/tag.js").Tag

// ADD TAGS FROM AN ARRAY OF TAGS
function addTags(req, res){
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
    
    let tags = req.body.tags.split(' ').filter(Boolean)

    for (i=0;i<tags.length;i++){
        let name = tags[i]
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

    res.redirect("/")
}

// REMOVE TAG BASED ON NAME
function removeTags(req, res){
    var name = req.body.name

    Tag.remove({
        name : name
    }).then(()=>{
        res.redirect("/")
    })

}

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

// GET TOP 5 POPULAR TAGS BASED ON NUMBER OF POSTS
function getPopularTags(req, res){
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
}

// GET ALL TAGS
function getAllTags(req,res){
    Tag.find({

    }).then((tags)=>{
        res.send({
            tags
        })
    })
}