var Financial = require("../models/financial"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
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
router.post("/", isLoggedIn, function(req, res){
    
    	Financial.create(req.body.financial, function(err, financial){
    		if(err){
    			console.log(err);
    		}else{
    			res.redirect("/financial");
    		}
    	});
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
router.put("/:id", isLoggedIn, function(req, res){
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