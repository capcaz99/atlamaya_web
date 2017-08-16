var passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override"),
	LocalStrategy         = require("passport-local"),
	User                  = require("./models/user"),
	bodyParser            = require("body-parser"),
	mongoose              = require("mongoose"),
	passport              = require("passport"),
	express               = require("express"),
	request               = require("request"),
	app                   = express();

var maintenanceRoutes = require("./routes/maintenance"),
	securityRoutes    = require("./routes/security"),
	adminRoutes 	  = require("./routes/admin"),
	indexRoutes 	  = require("./routes/index"),
	tableRoutes	      = require("./routes/table");

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


//Routes
app.use("/maintenance",maintenanceRoutes);
app.use(indexRoutes);
app.use("/table",tableRoutes);
app.use(adminRoutes);
app.use("/security", securityRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});


