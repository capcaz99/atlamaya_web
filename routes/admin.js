var express = require("express"),
    router  = express.Router();
    
//===============================
//Admin
//===============================

router.get("/administrador", isLoggedIn, function(req, res) {
	if(req.user.admin){
		res.render("administrador");
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