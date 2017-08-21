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
		res.redirect("/"); //%%%%%%%%%%%%%Agregar mensaje de error
	}
    
});




function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}	

module.exports = router;