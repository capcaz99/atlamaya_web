var Regulation = require("../models/regulation"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

//===============================
//Regulations
//===============================

//Index 
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Regulation.find({} , function(err, regulation){
		if(err){
			console.log(err);
		}else{
			res.render("regulations/index", {regulation: regulation, user: user});	
		}
	});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		res.render("regulations/new", {user: user});
	}else{
		res.redirect("/regulation");
	}
    
});

//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
    	req.body.regulation.document = res.locals.url;
    	Regulation.create(req.body.regulation, function(err, regulation){
    		if(err){
    			console.log(err);
    		}else{
    			res.redirect("/regulation");
    		}
    	});
});


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		 Regulation.findById(req.params.id, function(err, regulation){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("regulations/edit",{regulation: regulation, user: user});
    	}
    });
	}else{
		res.redirect("/regulation");
	}
   
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	req.body.regulation.document = res.locals.url;
	Regulation.findByIdAndUpdate(req.params.id, req.body.regulation, function(err, regulation){
		if(err){
			console.log(err);
		}else{
		    res.redirect("/regulation");
			
		}
	});
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	Regulation.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/regulation");
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