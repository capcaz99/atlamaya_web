var express = require("express"),
    router  = express.Router();
    
//===============================
//Admin
//===============================

router.get("/administrador", isLoggedIn, function(req, res) {
    var user = req.user;
	if(user.admin){
		res.render("administrador", {user: user});
	}else{
	    req.flash("error","Debes ser administrador para ingresar a esa página.");
		res.redirect("/"); 
	}
    
});




function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Debes iniciar sesión para ingresar a esa página.");
    res.redirect("/login");
}	

module.exports = router;