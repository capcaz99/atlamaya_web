var Security = require("../models/security"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
 const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

//===============================
//Secutiry
//===============================

//Index    
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Security.find({}, function(err, security){
		if(err){
			console.log(err);
		}else{
			res.render("security/index", {security: security, user: user});	
		}
	});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		res.render("security/new",{user: user});
	}else{
		res.redirect("/security");
	}
    
});


//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
req.body.security.image = res.locals.url;
Security.create(req.body.security, function(err, security){
		if(err){
			console.log(err);
		}else{
			res.redirect("/security");
		}
	});
});

//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		 Security.findById(req.params.id, function(err, security){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("security/edit",{security: security, user: user});
    	}
    });
	}else{
		res.redirect("/security");
	}
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	req.body.security.image = res.locals.url;
	Security.findByIdAndUpdate(req.params.id, req.body.security, function(err, security){
		if(err){
			console.log(err);
		}else{
		    res.redirect("/security");
			
		}
	});
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	Security.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/security");
		}
	});
});



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}	

module.exports = router;
