var Maintenance = require("../models/maintenance"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});


const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
        
    
//===============================
//Maintenance
//===============================

//Index 
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Maintenance.find({} , function(err, maintenance){
		if(err){
			console.log(err);
		}else{
			res.render("maintenance/index", {maintenance: maintenance, user: user});	
		}
	});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		res.render("maintenance/new", {user, user});
	}else{
		res.redirect("/maintenance");
	}
    
});

//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload,function(req, res){
    req.body.maintenance.image = res.locals.url;
    	Maintenance.create(req.body.maintenance, function(err, maintenance){
    		if(err){
    			console.log(err);
    		}else{
    			res.redirect("/maintenance");
    		}
    	});
});


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		 Maintenance.findById(req.params.id, function(err, maintenance){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("maintenance/edit",{maintenance: maintenance, user: user});
    	}
    });
	}else{
		res.redirect("/maintenance");
	}
   
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	req.body.maintenance.image = res.locals.url;
	Maintenance.findByIdAndUpdate(req.params.id, req.body.maintenance, function(err, maintenance){
		if(err){
			console.log(err);
		}else{
		    res.redirect("/maintenance");
			
		}
	});
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	Maintenance.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/maintenance");
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