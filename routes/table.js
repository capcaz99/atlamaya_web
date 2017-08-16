var Table    = require("../models/table"),
    express = require("express"),
    router  = express.Router();


//===============================
//Table
//===============================

//Index
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Table.find({}, function(err, table){
		if(err){
			console.log(err);
		}else{
			res.render("table/index", {table: table, user: user});	
		}
	})
    
})

//New
router.get("/new", isLoggedIn, function(req, res) {
	if(req.user.admin){
		res.render("table/new");
	}else{
		res.redirect("/table");
	}
    
});

//Create
router.post("/", isLoggedIn, function(req, res){
	Table.create(req.body.table, function(err, table){
		if(err){
			console.log(err);
		}else{
			res.redirect("/table");
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
    		res.render("table/edit",{table: table});
    	}
    });
	}else{
		res.redirect("/table");
	}
   
});

//Update
router.put("/:id", isLoggedIn, function(req, res){
	Table.findByIdAndUpdate(req.params.id, req.body.table, function(err, table){
		if(err){
			console.log(err);
		}else{
			res.redirect("/table");
		}
	});
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	Table.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/table");
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