var Ad          = require("../models/ad"),
    User        = require("../models/user"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
//===============================
//Ad 
//===============================

//Index all 
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	var show = true; //Show all ads.
	
	Ad.find({}, function(err, ad) {
		if(err){
			console.log("Ad find error"+err);
		}else{
		    res.render("payments/index", {ad: ad, user: user, show: show});
		}
	});
});


//Personal Index 
router.get("/me", isLoggedIn, function(req, res) {
	var user = req.user;
	var show = false; //Show only users ads
	var ads = [];
	req.user.ads.forEach(function(ad){
			
			Ad.findById(ad, function(err, ad) {
				if(err){
					console.log("Ad find error"+err);
				}else{
					ads.push(ad);
				}
				if(ads.length == req.user.ad.length){
					res.render("ad/index", {ad: ad, user: user, show: show});
				}
			});
		});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	res.render("payments/new",{user: user});   
});

//Create
router.post("/", isLoggedIn, function(req, res){
    var user = req.user;
    Ad.create(req.body.ad, function(err, ad){
    		if(err){
    			console.log("Error al crear anuncio"+err);
    		}else{
    		    user.ads.push(ad);
                user.save(function(err, data){
                    if(err){
                        console.log("User save"+ err);
                    }else{
                        console.log(data);
                        res.redirect("/ad");
                    }
                });
            }
    });
});



//Show
router.get("/:id", isLoggedIn, function(req, res){
	var user = req.user;
	Ad.findById(req.params.id, function(err, ad){
		if(err){
			console.log("Error en show de ad"+ err);
		}else{
			res.render("ad/show", {user: user, ad: ad});
		}
	});
});


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	    Ad.findById(req.params.id, function(err, ad){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("ad/edit",{ad: ad, user: user});
    	}
    });
});

//Update
router.put("/:id", isLoggedIn, function(req, res){
    Ad.findByIdAndUpdate(req.params.id, req.body.ad, function(err, ad){
			if(err){
				console.log(err);
			}else{
			    res.redirect("/ad/"+req.body.ad._id);
				
			}
		});	
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
    var user = req.user;
		Ad.findByIdAndRemove(req.params.id, function(err){
			if(err){
			console.log(err);
			}else{
				var adId = new mongoose.Types.ObjectId(req.params.id);
				User.findByIdAndUpdate(req.params.user._id, 
				{$pull:{"ad": adId}}, {safe: true},function(err, data){
					if(err){
						console.log("ERROR AL ELIMINAR DE USUARIO ad" + err);
					}else{
						res.redirect("/ad");
					}
				});
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