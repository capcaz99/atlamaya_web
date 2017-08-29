var News = require("../models/news"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
//===============================
//News
//===============================


//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		res.render("news/new", {user: user});
	}else{
		res.redirect("/");
	}
    
});

//Create
router.post("/", isLoggedIn, function(req, res){
	var user = req.user;
	if(user.admin){
			News.create(req.body.news, function(err, news){
    		if(err){
    			console.log(err);
    		}else{
    			res.redirect("/");
    		}
    	});
	}else{
		res.redirect("/");
	}
    
});

//Show
router.get("/:id", isLoggedIn, function(req, res){
	var user = req.user;
	News.findById(req.params.id, function(err, news){
		if(err){
			console.log("Error en show"+ err)
		}else{
			res.render("news/show", {user: user, news: news})
		}
	})
})


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(user.admin){
		 News.findById(req.params.id, function(err, news){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("news/edit",{news: news, user: user});
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