var passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override"),
	LocalStrategy         = require("passport-local"),
	User                  = require("./models/user"),
	serveStatic 		  = require('serve-static'),
	bodyParser            = require("body-parser"),
	mongoose              = require("mongoose"),
	passport              = require("passport"),
	express               = require("express"),
	request               = require("request"),
	app                   = express();
	
	



var maintenanceRoutes = require("./routes/maintenance"),
	regulationsRoutes = require("./routes/regulations"),
	financialRoutes   = require("./routes/financial"),
	securityRoutes    = require("./routes/security"),
	paymentRoutes     = require("./routes/payments"),
	galleryRoutes     = require("./routes/gallery"),
	photosRoutes      = require("./routes/photos"),
	adminRoutes 	  = require("./routes/admin"),
	indexRoutes 	  = require("./routes/index"),
	tableRoutes	      = require("./routes/table"),
	newsRoutes		  = require("./routes/news"),
	adRoutes		  = require("./routes/ad");


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
app.use(serveStatic('atlamaya_web/'));


//Routes
app.use("/maintenance",maintenanceRoutes);
app.use("/regulation", regulationsRoutes);
app.use("/financial", financialRoutes);
app.use("/security", securityRoutes);
app.use("/payments", paymentRoutes);
app.use("/gallery", galleryRoutes);
app.use("/photos", photosRoutes);
app.use("/table",tableRoutes);
app.use("/news",newsRoutes);
app.use("/ad", adRoutes);
app.use(indexRoutes);
app.use(adminRoutes);






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});


