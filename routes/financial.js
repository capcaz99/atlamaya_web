var Financial = require("../models/financial"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();    
//===============================
//Financial 
//===============================

//Index 
router.get("/", isLoggedIn, function(req, res) {
	var user = req.user;
	Financial.find({} , function(err, financial){
		if(err){
			console.log("Hubo un error encontrando los estados financieros"+err);
			req.flash("error","Hubo un error buscando los estados financieros, vuelve a intentarlo.");
			res.redirect("/");
		}else{
			res.render("financial/index", {financial: financial, user: user});	
		}
	});
    
});

//New
router.get("/new", isLoggedIn, function(req, res) {
	var user = req.user;
	if(req.user.admin){
		res.render("financial/new",{user, user});
	}else{
		req.flash("error","Debes ser administrador para agregar un estado financiero.");
		res.redirect("/financial");
	}
    
});

//Create
router.post("/", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	if(req.user.admin){
    	req.body.financial.document = res.locals.url;
    	Financial.create(req.body.financial, function(err, financial){
    		if(err){
    			req.flash("error","Hubo un error subiendo el estado financiero, vuelve a intentarlo.");
    			res.redirect("/financial/new");
    			console.log("Error subiendo un estado financiero"+err);
    		}else{
    			req.flash("success","Se ha subido el estado financiero.");
    			res.redirect("/financial");
    		}
    	});
	}else{
		req.flash("error","Debes ser administrador para agregar un estado financiero.");
		res.redirect("/");
	}
});


//Edit
router.get("/:id/edit", isLoggedIn, function(req, res) {
	var user = req.user;
	if(req.user.admin){
		 Financial.findById(req.params.id, function(err, financial){
    	if(err){
    		console.log("Error buscando el estado financiero "+err);
    		req.flash("error","Hubo un error buscando el estado financiero, vuelve a intentarlo.");
    		res.redirect("/financial");
    	}else{
    		res.render("financial/edit",{financial: financial, user: user});
    	}
    });
	}else{
		req.flash("error","Debes ser administrador para editar un estado financiero.");
		res.redirect("/financial");
	}
   
});

//Update
router.put("/:id", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
	var user = req.user;
	if(user.admin){
		req.body.financial.document = res.locals.url;
		Financial.findByIdAndUpdate(req.params.id, req.body.financial, function(err, financial){
			if(err){
				console.log("Error editando el esatado finacniero"+err);
				req.flash("error","Hubo un error actualizando el estado financiero, vuelve a intentarlo.");
	    		res.redirect("/financial/"+req.params.id+"/edit");
			}else{
				req.flash("success","Se ha editado el estado financiero.");
			    res.redirect("/financial");
				
			}
		});	
	}else{
		req.flash("error","Debes ser administrador para editar un estado financiero.");
		res.redirect("/financial");
	}
});

//Destroy
router.delete("/:id", isLoggedIn, function(req, res){
	if(req.user.admin){
		Financial.findByIdAndRemove(req.params.id, function(err){
			if(err){
				console.log(err);
				req.flash("error","Hubo un error eliminando el estado financiero, vuelve a intentarlo.");
				res.redirect("/financial");
			}else{
				req.flash("success","Se ha eliminado el estado financiero.");
				res.redirect("/financial");
			}
		});
	}else{
		req.flash("error","Debes ser administrador para eliminar un estado financiero.");
		res.redirect("/financial");
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