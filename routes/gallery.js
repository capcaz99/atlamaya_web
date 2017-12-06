var Gallery     = require("../models/gallery"),
    Photos      = require("../models/photos"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
        
//===============================
//Gallery 
//===============================

//Index
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Gallery.find({}, function(err, gallery) {
	    if(err){
		    console.log("Hubo un error encontrando las galerías"+err);
			req.flash("error","Hubo un error buscando las galerías, vuelve a intentarlo.");
			res.redirect("/");
	    }else{
		    res.render("gallery/index", {gallery: gallery, user: user});
		}			
	});
});


//New
router.get("/new", isLoggedIn,  function(req, res) {
	var user = req.user;
	if(req.user.admin){
	    res.render("gallery/new",{user: user});  
	}else{
		req.flash("error","Debes ser administrador para agregar una galería.");
		res.redirect("/gallery");
	}
});

//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
    var user = req.user;
    if (user.admin){
    	req.body.gallery.cover = res.locals.url;
        Gallery.create(req.body.gallery, function(err, gallery){
    		if(err){
    			req.flash("error","Hubo un error creando la galería, vuelve a intentarlo.");
    			res.redirect("/gallery/new");
    			console.log(err);
    		}else{
    			req.flash("success","Se ha creado la galería.");
    			res.redirect("/gallery");
    		}
    });
    }else{
    	req.flash("error","Debes ser administrador para crear una galería.");
      res.redirect("/gallery");
    }
    
});


//Show
router.get("/:id", isLoggedIn, function(req, res){
	var user = req.user;
	Gallery.findById(req.params.id).populate("photos").exec(function(err, gallery){
		if(err){
			console.log("Error en show de gallery"+ err);
			req.flash("error","Hubo un error buscando la galería, vuelve a intentarlo.");
    		res.redirect("/gallery");
		}else{
			res.render("gallery/show", {user: user, gallery: gallery});
		}
	});
});


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(req.user.admin){
		 Gallery.findById(req.params.id, function(err, gallery){
    	if(err){
    		console.log(err);
    		req.flash("error","Hubo un error buscando la galería, vuelve a intentarlo.");
    		res.redirect("/gallery");
    	}else{
    		res.render("gallery/edit",{gallery: gallery, user: user});
    	}
    });
	}else{
		req.flash("error","Debes ser administrador para editar una galería.");
		res.redirect("/gallery");
	}
   
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	if(req.user.admin){
		req.body.gallery.cover = res.locals.url;
		Gallery.findByIdAndUpdate(req.params.id, req.body.gallery, function(err, gallery){
			if(err){
				console.log("Error editando glaería"+err);
				req.flash("error","Hubo un error actualizando la galería, vuelve a intentarlo.");
	    		res.redirect("/gallery/"+req.params.id+"/edit");
			}else{
				req.flash("success","Se ha editado la galería.");
			    res.redirect("/gallery");
				
			}
		});	
	}else{
		req.flash("error","Debes ser administrador para editar una glaería.");
		res.redirect("/gallery");
	}
	
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	if(req.user.admin){
	    Gallery.findById(req.params.id, function(err, gallery){
		    if(err){
		        console.log("Error encontrando la galeria"+err);
				req.flash("error","Hubo un error eliminando la galería, vuelve a intentarlo.");
				res.redirect("/gallery");
		    }else{
		    	
		    	if(gallery.photos.length >0){
		        var cont = 0;
		        var max  = gallery.photos.length;
		        gallery.photos.forEach(function(photos){
		            Photos.findByIdAndRemove(photos, function(err){
    		            if(err){
    		                console.log("Error al eliminar foto"+err);
    		                req.flash("error","Hubo un error eliminando la galería, vuelve a intentarlo.");
							res.redirect("/gallery");
    		            }else{
    		            	
    		                cont++;
    		            } 
		            if(cont == max){
    		            Gallery.findByIdAndRemove(req.params.id, function(err){
    		                if(err){
    		                    console.log("Error al eliminar galeria"+err);
    		                    req.flash("error","Hubo un error eliminando la galería, vuelve a intentarlo.");
								res.redirect("/gallery");
    		                }else{
    		                	req.flash("success","Se ha eliminado la galería.");
    		                    res.redirect("/gallery");
    		                }
    		            });
		            }
		          });
    		    });
		    	}else{
		    		Gallery.findByIdAndRemove(req.params.id, function(err){
    		                if(err){
    		                    console.log("Error al eliminar galeria"+err);
    		                    req.flash("error","Hubo un error eliminando la galería, vuelve a intentarlo.");
								res.redirect("/gallery");
    		                }else{
    		                	req.flash("success","Se ha eliminado la galería.");
    		                    res.redirect("/gallery");
    		                }
    		            });
		    	}	
		    }
	    });
	}else{
		res.redirect("/gallery");
	}
});
	



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Debes iniciar sesión para ingresar a esa página");
    res.redirect("/login");
}	

module.exports = router;