var Table    = require("../models/table"),
    express = require("express"),
    router  = express.Router();

const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

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
	var user = req.user;
	if(user.admin){
		res.render("table/new", {user: user});
	}else{
		res.redirect("/table");
	}
    
});

//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	req.body.table.image = res.locals.url;
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
	var user = req.user;
	if(user.admin){
		 Table.findById(req.params.id, function(err, table){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("table/edit",{table: table, user: user});
    	}
    });
	}else{
		res.redirect("/table");
	}
   
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	req.body.table.image = res.locals.url;
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