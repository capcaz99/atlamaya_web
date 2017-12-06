var Ad          = require("../models/ad"),
    User        = require("../models/user"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
        
const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
    
    
//===============================
//Ad 
//===============================

//Index all 
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	var show = false; //Show all ads without buttons
	
	Ad.find({}, function(err, ad) {
		if(err){
			console.log("Hubo un error encontrando los anuncios"+err);
			req.flash("error","Hubo un error buscando los anuncios, vuelve a intentarlo.");
			res.redirect("/");
		}else{
		    res.render("ad/index",{ad: ad, user: user, show: show});
		}
	});
});


//Personal Index 
router.get("/me", isLoggedIn, function(req, res) {
	var user = req.user;
	var show = true; //Show buttons to edit and delete
	var ads = [];
	if(req.user.ads.length === 0){
		req.flash("error","No tienes anuncios, agrega uno para poderlo ver.")
		res.redirect("/ad");
	}else{
		req.user.ads.forEach(function(ad){
		Ad.findById(ad, function(err, ad) {
				if(err){
					console.log("Ad find error"+err);
					req.flash("error","Hubo un error buscando los anuncios, vuelve a intentarlo.");
					res.redirect("/");
				}else{
					ads.push(ad);
				}
				if(ads.length == req.user.ads.length){
					res.render("ad/index", {ad: ads, user: user, show: show});
				}
			});
		});
	}
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	res.render("ad/new",{user: user});   
});

//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
    var user = req.user;
    req.body.ad.image = res.locals.url;
    Ad.create(req.body.ad, function(err, ad){
    		if(err){
    			console.log("Error al crear anuncio"+err);
    			req.flash("error","Hubo un error creando el anuncio, vuelve a intentarlo.");
    			res.redirect("/ad/new");
    		}else{
    		    user.ads.push(ad);
                user.save(function(err, data){
                    if(err){
                        console.log("User save"+ err);
                        req.flash("error","Hubo un error creando el anuncio, vuelve a intentarlo.");
    					res.redirect("/ad/new");
                    }else{
                    	req.flash("success","Se ha creado el anuncio");
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
			req.flash("error","Hubo un error buscando el anuncio, vuelve a intentarlo.");
    		res.redirect("/ad/new");
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
    		req.flash("error","Hubo un error buscando el anuncio, vuelve a intentarlo.");
    		res.redirect("/ad");
    	}else{
    		res.render("ad/edit",{ad: ad, user: user});
    	}
    });
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	req.body.ad.image = res.locals.url;
    Ad.findByIdAndUpdate(req.params.id, req.body.ad, function(err, ad){
			if(err){
				console.log(err);
				req.flash("error","Hubo un error actualizando el anuncio, vuelve a intentarlo.");
    			res.redirect("/ad/"+req.params.id+"/edit");
			}else{
				req.flash("success","Se ha editado el anuncio.");
			    res.redirect("/ad/"+ad._id);
				
			}
		});	
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
    var user = req.user;
    
		Ad.findByIdAndRemove(req.params.id, function(err){
			if(err){
			console.log("Error al elimnar buscando ad "+ err);
			req.flash("error","Hubo un error eliminando el anuncio, vuelve a intentarlo.");
    		res.redirect("/ad/me");
			}else{
				var adId = new mongoose.Types.ObjectId(req.params.id);
				User.findByIdAndUpdate(req.user._id, 
				{$pull:{"ads": adId}}, {safe: true},function(err, data){
					if(err){
						console.log("ERROR AL ELIMINAR DE USUARIO ad" + err);
						req.flash("error","Hubo un error eliminando el anuncio, vuelve a intentarlo.");
    					req.redirect("/ad/me");
					}else{
						req.flash("success","Se ha eliminado el anuncio.");
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
    req.flash("error","Debes iniciar sesión para ingresar a esa página");
    res.redirect("/login");
}	

module.exports = router;