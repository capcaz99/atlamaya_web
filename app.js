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




app.get("/", function(req, res){
    res.render("home");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});