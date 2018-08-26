const express = require("express")
const path = require("path")
const hbs = require("hbs")
const mongoose = require("mongoose")
const session= require("express-session")
const moment = require("moment")
const favicon = require("serve-favicon")

/*                  SETUP               */
var app = express()
app.use(favicon(path.join(__dirname, 'icons', 'favicon.ico')))
app.set("view engine", "hbs")
hbs.registerPartials(__dirname+"/views/partials")
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/MP2",{
    useNewUrlParser:true
})
app.use(express.static(__dirname+"/static"))
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
app.use(require("./controllers"))

// HBS HELPER TO CHECK FOR EQUALITY
hbs.registerHelper("equal", (n,a)=>{
    return n==a;
})

hbs.registerHelper("notEqual", (n,a)=>{
    return n!=a;
})

// HBS HELPER TO CHECK FOR PRIVACY
hbs.registerHelper("isPrivate", (n)=>{
    return n=="private";
})

// HBS HELPER TO CHECK IF PUBLIC
hbs.registerHelper("isPublic", (n)=>{
    return n=="public";
})

// HBS HELPER TO FORMAT DATE OBJECTS
hbs.registerHelper("formatDate", (date)=>{
    return moment(date).format('MMM DD, YYYY');
})

// HBS HELPER TO FORMAT DATE OBJECTS
hbs.registerHelper("isValid", (username, profilename, privacy, shared_users)=>{
    if (username == profilename)
        return true
    if (privacy=="public")
        return true
    console.log(shared_users)
    if (shared_users.indexOf(username) != -1)
        return true
    
    return false
})

// SETUP STATIC FILES
app.use(express.static(path.join(__dirname, "static")))

/*                  ROUTES               */
app.listen(3000, ()=>{
    //clearDB()
    //addDummyValues()
    console.log("Now listening on port 3000...")
})