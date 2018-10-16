var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware");


//SHOW-user profile route
router.get("/:id", function(req, res){
   User.findById(req.params.id, function(err, user){
       if(err){
          req.flash("error", "Something went wrong.");
          res.redirect("/");
       }
       Campground.find().where("author.id").equals(user._id).exec(function(err, campgrounds){
           if(err){
            req.flash("error", "Something went wrong.");
            res.redirect("/");
       }
        Comment.find().where("author.id").equals(user._id).exec(function(err, comments){
           if(err){
            req.flash("error", "Something went wrong.");
            res.redirect("/");
       }
       
        res.render("users/show", {user: user, campgrounds: campgrounds, comments: comments});
        
       });
     });
   }); 
});

//EDIT- user edit profile route
router.get("/:id/edit", middleware.checkUserOwnership, function(req, res){
     User.findById(req.params.id, function(err, user){
       if(err){
          req.flash("error", "Something went wrong.");
          res.redirect("/");
       }
        res.render("users/edit", {user: user});
    });   
});   

//UPDATE- user update profile route
router.put("/:id", middleware.checkUserOwnership, function(req, res){
     User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
         if(err){
              res.redirect("back");
        } else{
            res.redirect("/users/"+req.params.id);
        }
    });
});

module.exports = router;