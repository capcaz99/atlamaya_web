var Payment     = require("../models/payment"),
    User        =require("../models/user"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
    
//===============================
//Financial 
//===============================

//Index user
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	var payment = req.user.payment;
	var show = false; //Show only users payments
	res.render("payments/index", {payment: payment, user: user, show: show});	
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
		res.redirect("/payment");
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
    			res.redirect("/payment");
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
	Payment.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			if(req.user.admin){
				res.redirect("/payment/admin");
			}else{
				res.redirect("/payments");
			}
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