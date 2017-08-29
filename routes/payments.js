var Payment     = require("../models/payment"),
    User        = require("../models/user"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
//===============================
//Financial 
//===============================

//Index user
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	var show = false; //Show only users payments
	var payment =[];
	
	if(req.user.payments.length === 0){
			
			res.render("payments/index", {payment: payment, user: user, show: show});
	}else{
		req.user.payments.forEach(function(pay){
			console.log(pay);
			Payment.findById(pay, function(err, paym) {
				if(err){
					console.log("Payment find error"+err);
				}else{
					payment.push(paym);
					
				}
				if(payment.length == req.user.payments.length){
					res.render("payments/index", {payment: payment, user: user, show: show});
				}
			});
		});
	}
});

//Index admin
router.get("/admin", isLoggedIn, function(req, res) {
	var user = req.user;
	var show = true; //Show all payments
	User.find({}).populate("payments").exec(function(err, allUsers){
		if(err){
			console.log(err);
		}else{
			
			res.render("payments/index", {allUsers: allUsers, user: user, show:show});	
		}
	});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	if(req.user.admin){
	    User.find({}, function(err, allUsers){
	        if(err){
	            console.log(err);
	        }else{
	          res.render("payments/new",{user, user, allUsers: allUsers});  
	        }
	    });
	}else{
		res.redirect("/payments");
	}
    
});

//Create
router.post("/", isLoggedIn, function(req, res){
    Payment.create(req.body.payment, function(err, payment){
    		if(err){
    			console.log(err);
    		}else{
    		    User.findOne({_id: req.body.userid }, function(err, user){
                    if(err){
                        console.log("User find"+ err)
                    }else{
                        user.payments.push(payment);
                        user.save(function(err, data){
                        if(err){
                            console.log("User save"+ err);
                        }else{
                            console.log(data);
                        }
                        });
                    }
                    });
    			res.redirect("/payments/admin");
    		}
    });
});






//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(req.user.admin){
		 Payment.findById(req.params.id, function(err, payment){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("payments/edit",{payment: payment, user: user});
    	}
    });
	}else{
		res.redirect("/payments");
	}
   
});

//Update
router.put("/:id", isLoggedIn, function(req, res){
	if(req.user.admin){
		Payment.findByIdAndUpdate(req.params.id, req.body.payment, function(err, payment){
			if(err){
				console.log(err);
			}else{
			    res.redirect("/payments/admin");
				
			}
		});	
	}else{
		res.redirect("/payments");
	}
	
});

//Destroy
router.delete("/:id/:user_id", isLoggedIn, function(req, res){
	if(req.user.admin){
		Payment.findByIdAndRemove(req.params.id, function(err){
			if(err){
			console.log(err);
			}else{
				var paymentId = new mongoose.Types.ObjectId(req.params.id);
				User.findByIdAndUpdate(req.params.user_id, 
				{$pull:{"payments": paymentId}}, {safe: true},function(err, data){
					if(err){
						console.log("ERROR AL ELIMINAR DE USUARIO" + err);
					}else{
						console.log("se supone que si..."+data);
						res.redirect("/payments/admin");
					}
				});
			}
		});
	}else{
		res.redirect("/payments");
	}
});
	



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}	

module.exports = router;