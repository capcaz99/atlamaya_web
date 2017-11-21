var User     = require("../models/user.js"),
    Payment  = require("../models/payment"),
    Ad       = require("../models/ad"),
    passport = require("passport"),
    express  = require("express"),
    router   = express.Router();
   
//Edit by user (not admin).   
router.get("/",isLoggedIn, function(req,res){
    res.render("users/edit",{user:req.user});
});  


//Edit by admin
router.get("/edit/:id",isLoggedIn, function(req,res){
    res.render("users/editAd",{user:req.user, idUser:req.params.id});
});  

//Edit 
router.put("/:id", isLoggedIn, function(req, res){
		User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
			if(err){
				console.log(err);
			}else{
			    res.redirect("/users/table");
			}
		});	
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	if(req.user.admin){
		User.findById(req.params.id, function(err, user){
			if(err){
			    console.log(err);
			}else{
				if(user.payments.length >0){
					var cont = 0;
			    	var max = user.payments.length;
			    	user.payments.forEach(function(payment){
			    		Payment.findByIdAndRemove(payment, function(err){
	    		            if(err){
	    		                console.log("Error al eliminar pago"+err);
	    		            }else{
	    		                cont++;
	    		            }
				    		if(cont ==max){
				    			if(user.ads.length >0){
				    				cont = 0;
				    				max = user.ads.length;
				    				user.ads.forEach(function(ad){
					    				Ad.findByIdAndRemove(ad, function(err){
		    		                    	if(err){
		    		                       		console.log("Error al eliminar anuncio"+err);
		    		                    	}else{
		    		                        	cont++;
		    		                    	} 
				                    	
					                    	if(cont == max){
					                    		User.findByIdAndRemove(req.params.id, function(err){
				    		                        if(err){
				    		                            console.log("Error al eliminar usuario"+err);
				    		                        }else{
				    		                            res.redirect("/users/table");
			    		                        	}
					                        	});
					                    	}
				                    	});
				                    });
				    			}else{
				    				User.findByIdAndRemove(req.params.id, function(err){
		    		                	if(err){
		    		                    	console.log("Error al eliminar usuario"+err);
		    		                    }else{
		    		                    	res.redirect("/users/table");
	    		                        }
			                        });
				    			}
				    		}
				    	});
			    	});
			    }else{
			    	if(user.ads.length >0){
			    		var cont = 0;
			    		var max = user.ads.length;
			    		user.ads.forEach(function(ad){
		    				Ad.findByIdAndRemove(ad, function(err){
		                    	if(err){
		                       		console.log("Error al eliminar anuncio"+err);
		                    	}else{
		                        	cont++;
		                    	} 
		                	
		                    	if(cont == max){
		                    		User.findByIdAndRemove(req.params.id, function(err){
				                        if(err){
				                            console.log("Error al eliminar usuario"+err);
				                        }else{
				                            res.redirect("/users/table");
			                        	}
		                        	});
		                    	}
		                	});
		                });
	               	}else{
				    	User.findByIdAndRemove(req.params.id, function(err){
		                	if(err){
		                    	console.log("Error al eliminar usuario"+err);
		                    }else{
		                    	res.redirect("/users/table");
		                    }
		                });
				    }
			    }
			}
		});		
	}else{
		res.redirect("/");
	}
});
			    
			   


			    
			   


			    
			   


			    
			   




//------------------------------------------------
//Password
//------------------------------------------------

router.get("/password", isLoggedIn, function(req, res){
    res.render("users/password",{user:req.user});
});

router.put("/password/:id", isLoggedIn, function(req,res){
   if(req.user._id == req.params.id){	
	   User.findByUsername(req.user.username).then(function(sanitizedUser){
	    if (sanitizedUser){
	        sanitizedUser.setPassword(req.body.password, function(){
	            sanitizedUser.save();
	            res.redirect("/");
	        });
	    } else {
	        res.status(500).json({message: 'This user does not exist'});
	    }
	},function(err){
	    console.error(err);
		
	});}
	else{
		res.redirect("/");
	}
});


    

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;