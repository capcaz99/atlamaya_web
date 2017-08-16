var Maintenance = require("../models/maintenance"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
//===============================
//Maintenance
//===============================


//Index Security
router.get("/security", isLoggedIn, function(req, res) {
	var user = req.user;
	Maintenance.find({job: "true"}, function(err, maintenance){
		if(err){
			console.log(err);
		}else{
			res.render("maintenance/indexSecurity", {maintenance: maintenance, user: user});	
		}
	});
    
});

//Index Maintenance
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Table.find({job: "false"}, function(err, maintenance){
		if(err){
			console.log(err);
		}else{
			res.render("maintenance/indexMaintenance", {maintenance: maintenance, user: user});	
		}
	});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	if(req.user.admin){
		res.render("maintenance/new");
	}else{
		res.redirect("/maintenance");
	}
    
});

//Create
router.post("/", isLoggedIn, function(req, res){
	Maintenance.create(req.body.maintenance, function(err, maintenance){
		if(err){
			console.log(err);
		}else{
			if(req.body.maintenance.job){
				res.redirect("/maintenance/security");
				
			}else{
				res.redirect("/maintenance");
			}
		}
	})
});

//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	if(req.user.admin){
		 Table.findById(req.params.id, function(err, table){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("maintenance/edit",{table: table});
    	}
    });
	}else{
		res.redirect("/maintenance");
	}
   
});

//Update
router.put("/:id", isLoggedIn, function(req, res){
	Table.findByIdAndUpdate(req.params.id, req.body.table, function(err, table){
		if(err){
			console.log(err);
		}else{
			if(req.body.maintenance.job){
				res.redirect("/maintenance/security");
				
			}else{
				res.redirect("/maintenance");
			}
		}
	});
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	Table.findByIdAndRemove(req.params.id, function(err){
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