var User    = require("../models/user"),
    passport = require("passport"),
    express = require("express"),
    router  = express.Router();
    
    
    


//===============================
//Home
//===============================

router.get("/", isLoggedIn, function(req, res){
	var user = req.user;
    res.render("home", {user: user});
});


//===============================
//Authentication
//===============================

//REGISTER
router.get("/register", function(req, res){
	res.render("register");	
});

router.post("/register", function(req, res){
	  User.register(new User({
	  						    username  : req.body.username,
	  							address   : req.body.address,
	  							phone     : req.body.phone,
	  							reference : req.body.reference,
	  							blocked   : req.body.blocked,
	  							admin     : req.body.admin
							}
	  		), req.body.password, function(err, user){
        if(err){
            console.log(err);    //Falta manejar errores
            res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
               res.render("home"); 
            });
        }
    });
});

//LOGIN
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
    
});

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}	


module.exports = router;