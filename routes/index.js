var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// root route
router.get("/", function(req, res){
   res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handles sign up logic
router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar
        });
    if(req.body.adminCode === "Bacon1"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
})

//handles login logic
//app.post("/login", middleware, callbackFunction)
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
}), function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});



module.exports = router;