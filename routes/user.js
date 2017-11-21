var User     = require("../models/user.js"),
    passport = require("passport"),
    express  = require("express"),
    router   = express.Router();
   
//Edit by user (not admin).   
router.get("/",isLoggedIn, function(req,res){
    res.render("users/edit",{user:req.user});
});  


//Edit by admin
router.get("/edit/:id",isLoggedIn, function(req,res){
    res.render("users/editAd",{user:req.user, idUser:req.params.id});
});  

//Edit 
router.put("/:id", isLoggedIn, function(req, res){
		User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
			if(err){
				console.log(err);
			}else{
			    res.redirect("/users/table");
			}
		});	

	
});

//------------------------------------------------
//Password
//------------------------------------------------

router.get("/password", isLoggedIn, function(req, res){
    res.render("users/password",{user:req.user});
});

router.put("/password/:id", isLoggedIn, function(req,res){
   User.findByUsername(req.user.username).then(function(sanitizedUser){
    if (sanitizedUser){
        sanitizedUser.setPassword(req.body.password, function(){
            sanitizedUser.save();
            res.redirect("/");
        });
    } else {
        res.status(500).json({message: 'This user does not exist'});
    }
},function(err){
    console.error(err);
});
    
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;