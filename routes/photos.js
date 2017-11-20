var Gallery     = require("../models/gallery"),
    Photos      = require("../models/photos"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    router      = express.Router({mergeParams: true});
    
const Upload = require('../upload/upload.server.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

//===============================
//Photos 
//===============================

//New
router.get("/new/:galleryId", isLoggedIn, function(req, res) {
	var user = req.user;
	var galleryId = req.params.galleryId;
	if(req.user.admin){
	    res.render("photos/new",{user: user, galleryId: galleryId});  
	}else{
		res.redirect("/gallery");
	}
});

//Create
router.post("/:galleryId", isLoggedIn, multipartMiddleware, Upload.upload, function(req, res){
    if(req.user.admin){
        req.body.photo.image = res.locals.url;
        Photos.create(req.body.photo, function(err, photo){
    		if(err){
    			console.log(err);
    		}else{
    		    Gallery.findOne({_id: req.params.galleryId }, function(err, gallery){
                    if(err){
                        console.log("Gallery find"+ err);
                    }else{
                        gallery.photos.push(photo);
                        gallery.save(function(err){
                            if(err){
                                console.log("Gallery save"+ err);
                            }else{
                            
                            }
                        });
                    }
                    res.redirect("/gallery/"+gallery._id);
                });
    		}
        });
    }else{
        res.redirect("/gallery")
    }
});


//Destroy
router.delete("/:id/:gallery_id", isLoggedIn, function(req, res){
	if(req.user.admin){
		Photos.findByIdAndRemove(req.params.id, function(err){
			if(err){
			console.log(err);
			}else{
				var photoId = new mongoose.Types.ObjectId(req.params.id);
				Gallery.findByIdAndUpdate(req.params.gallery_id, 
				{$pull:{"photos": photoId}}, {safe: true},function(err, data){
					if(err){
						console.log("Error al eliminar photo" + err);
					}else{
						res.redirect("/gallery/"+req.params.gallery_id);
					}
				});
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
    res.redirect("/login");
}	

module.exports = router;