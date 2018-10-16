var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
   
     //verify that the user is logged in
     if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else{
                //verify that the campground is owned by the user
                //used .equals() because one is an object and the other is a string
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }    
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
        //res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
      //verify that the user is logged in
      if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else{
                //verify that the comment is owned by the user
                //used .equals() because one is an object and the other is a string
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }    
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
        //res.redirect("/login");
    }
}

middlewareObj.checkUserOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
          if(err){
                req.flash("error", "User not found");
                res.redirect("back");
            } else{
                 if( (foundUser.id == req.user._id) || req.user.isAdmin){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }    
            }    
        });
    } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
        //res.redirect("/login");
    }    
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}
module.exports = middlewareObj;