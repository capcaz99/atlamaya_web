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

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));

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
