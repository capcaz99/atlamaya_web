var News = require("../models/news"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
//===============================
//News
//===============================


//New
router.get("/new", isLoggedIn, function(req, res) {
	if(req.user.admin){
		res.render("news/new");
	}else{
		res.redirect("/");
	}
    
});

//Create
router.post("/", isLoggedIn, function(req, res){
    
    	News.create(req.body.news, function(err, news){
    		if(err){
    			console.log(err);
    		}else{
    			res.redirect("/");
    		}
    	});
});


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	if(req.user.admin){
		 News.findById(req.params.id, function(err, news){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("news/edit",{news: news});
    	}
    });
	}else{
		res.redirect("/");
	}
   
});

//Update
router.put("/:id", isLoggedIn, function(req, res){
	News.findByIdAndUpdate(req.params.id, req.body.news, function(err, news){
		if(err){
			console.log(err);
		}else{
		    res.redirect("/");
			
		}
	});
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	News.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/");
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