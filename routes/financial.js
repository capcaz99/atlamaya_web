var Financial = require("../models/financial"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();    
//===============================
//Financial 
//===============================

//Index 
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Financial.find({} , function(err, financial){
		if(err){
			console.log(err);
		}else{
			res.render("financial/index", {financial: financial, user: user});	
		}
	});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	if(req.user.admin){
		res.render("financial/new",{user, user});
	}else{
		res.redirect("/financial");
	}
    
});

//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	if(req.user.admin){
    	req.body.financial.document = res.locals.url;
    	Financial.create(req.body.financial, function(err, financial){
    		if(err){
    			console.log(err);
    		}else{
    			res.redirect("/financial");
    		}
    	});
	}else{
		res.redirect("/");
	}
});


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(req.user.admin){
		 Financial.findById(req.params.id, function(err, financial){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("financial/edit",{financial: financial, user: user});
    	}
    });
	}else{
		res.redirect("/financial");
	}
   
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	req.body.financial.document = res.locals.url;
	Financial.findByIdAndUpdate(req.params.id, req.body.financial, function(err, financial){
		if(err){
			console.log(err);
		}else{
		    res.redirect("/financial");
			
		}
	});
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	Financial.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/financial");
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