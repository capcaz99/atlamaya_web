var User       = require("../models/user.js"),
    News       = require("../models/news.js"),
    nodemailer = require('nodemailer'),
    passport   = require("passport"),
    express    = require("express"),
    router     = express.Router();
    
    
    


//===============================
//Home
//===============================

router.get("/", isLoggedIn, function(req, res){
	var user = req.user;
	News.find({} , function(err, news){
		if(err){
			console.log(err);
		}else{
			res.render("home", {user: user, news: news});	
		}
	});	
    
});

//USERS TABLE
router.get("/users/table", isLoggedIn, function(req, res){
    var user = req.user;
    if(user.admin){
        User.find({}, function(err, allUsers) {
            if(err){
                console.log("Error al cargas usuarios "+err)
            }else{
                res.render("users/table", {user: user, allUsers:allUsers});
            }
        })
    }else{
        res.redirect("/");
    }
})

//===============================
//Authentication
//===============================

//REGISTER
router.get("/register", function(req, res){
    var user = req.user;
    //if(user.admin){
        res.render("index/register", {user: user});	
    //}else{
      //  res.redirect("/");
    //}
	
});

router.post("/register", function(req, res){
      var currentUser = req.user;
	  User.register(new User({
	  						    username  : req.body.username,
	  							address   : req.body.address,
	  							phone     : req.body.phone,
	  							email     : req.body.email,
	  							reference : req.body.reference,
	  							blocked   : req.body.blocked,
	  							admin     : req.body.admin
							}
	  		), req.body.password, function(err, user){
        if(err){
            console.log(err);    //Falta manejar errores
            res.render("index/register");
        }else{
            News.find({}, function(err, news){
                    if(err){
                        console.log("News "+ err);
                    }else{
                        res.redirect("/users/table");
                    }
                })
                
            
        }
    });
});

//LOGIN
router.get("/login", function(req, res) {
    res.render("index/login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
    
});

//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}	



//===============================
//Forgot Password
//===============================

router.get("/forgotPassword", function(req, res) {
    res.render("index/forgot");
});

router.get("/email/:user",function(req, res) {
    res.render("index/email",{user:req.params.user});
});

router.post("/forgotPassword", function(req,res){
    User.findByUsername(req.body.username, function(err, use){
        if(err){
            console.log("Usuario mal puesto");
            res.redirect("/forgotPassword");
        }else{
            if(use.email == req.body.email){
                console.log("Correcto");
                var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'condominioatlamaya@gmail.com',
                    pass: 'Carlos@1812'
                  }
                });
                
                
                
                var mailOptions = {
                  from: 'condominioatlamaya@gmail.com',
                  to: req.body.email,
                  subject: 'Cambio de contraseña',
                  text: 'Para poder cambiar tu contraseña ve a este link para hacerlo: https://atlamaya-web-capcaz99.c9users.io/user/password/'+use._id
                            
                };
                
                
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                    res.redirect("/email/"+use.email);
                  }
                });
            }else{
                console.log("Error");
                res.redirect("/forgotPassword");
            }
        }
    });
    
});

module.exports = router;

