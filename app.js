var passportLocalMongoose = require("passport-local-mongoose"),
    Maintenance 		  = require("./models/maintenance"),
	Regulation            = require("./models/regulation"),
	Financial   		  = require("./models/financial"),
	Payment               = require("./models/payment"),
	methodOverride        = require("method-override"),
	LocalStrategy         = require("passport-local"),
	Table                 = require("./models/table"),
	User                  = require("./models/user"),
	Ad                    = require("./models/ad"),
	bodyParser            = require("body-parser"),
	mongoose              = require("mongoose"),
	passport              = require("passport"),
	express               = require("express"),
	request               = require("request"),
	app                   = express();


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Falta manejo de errores

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/atlamaya", {useMongoClient: true});


//Passport
app.use(require("express-session")({
	secret: "Every thing counts in the world",
	resave: false,
	saveUninitialized: false
}));   
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));


//===============================
//Home
//===============================

app.get("/", isLoggedIn, function(req, res){
	var user = req.user;
    res.render("home", {user: user});
});


//===============================
//Authentication
//===============================

//REGISTER
app.get("/register", function(req, res){
	res.render("register");	
});

app.post("/register", function(req, res){
	  User.register(new User({
	  						    username  : req.body.username,
	  							address   : req.body.address,
	  							phone     : req.body.phone,
	  							reference : req.body.reference,
	  							blocked   : req.body.blocked,
	  							admin     : req.body.admin
							}
	  		), req.body.password, function(err, user){
        if(err){
            console.log(err);    //Falta manejar errores
            res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
               res.render("home"); 
            });
        }
    });
});

//LOGIN
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
    
});

//LOGOUT
app.get("/logout", function(req, res) {
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
//Admin
//===============================

app.get("/administrador", isLoggedIn, function(req, res) {
	if(req.user.admin){
		res.render("administrador");
	}else{
		res.redirect("/"); //%%%%%%%%%%%%%Agregar mensaje de error
	}
    
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});


//===============================
//Table
//===============================

//Index
app.get("/table", isLoggedIn, function(req, res) {
	var user = req.user;
	Table.find({}, function(err, table){
		if(err){
			console.log(err);
		}else{
			res.render("table/index", {table: table, user: user});	
		}
	})
    
})

//New
app.get("/table/new", isLoggedIn, function(req, res) {
	if(req.user.admin){
		res.render("table/new");
	}else{
		res.redirect("/table");
	}
    
});

//Create
app.post("/table", isLoggedIn, function(req, res){
	Table.create(req.body.table, function(err, table){
		if(err){
			console.log(err);
		}else{
			res.redirect("/table");
		}
	})
});

//Edit
app.get("/table/:id/edit", isLoggedIn, function(req, res) {
	if(req.user.admin){
		 Table.findById(req.params.id, function(err, table){
    	if(err){
    		console.log(err);
    	}else{
    		res.render("table/edit",{table: table});
    	}
    });
	}else{
		res.redirect("/table");
	}
   
});

//Update
app.put("/table/:id", isLoggedIn, function(req, res){
	Table.findByIdAndUpdate(req.params.id, req.body.table, function(err, table){
		if(err){
			console.log(err);
		}else{
			res.redirect("/table");
		}
	});
});

//Destroy
app.delete("/table/:id", isLoggedIn, function(req, res){
	Table.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/table");
		}
	});
});