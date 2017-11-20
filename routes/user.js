var User     = require("../models/user.js"),
    passport = require("passport"),
    express  = require("express"),
    router   = express.Router();
   

router.get("/",isLoggedIn, function(req,res){
    res.render("users/edit",{user:req.user});
});  

//Edit by user (not admin).    
router.put("/:id", isLoggedIn, function(req, res){
	if(req.user.admin){
		User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
			if(err){
				console.log(err);
			}else{
			    res.redirect("/user");
				
			}
		});	
	}else{
		res.redirect("/payments");
	}
	
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;