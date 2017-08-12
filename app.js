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




app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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

app.get("/", function(req, res){
    res.render("home");
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

app.get("/administrador", function(req, res) {
    res.render("administrador");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});