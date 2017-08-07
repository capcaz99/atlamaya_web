var maintenance    = require("./models/maintenance"),
	regulation     = require("./models/regulation"),
	financial      = require("./models/financial"),
	payment        = require("./models/payment"),
	methodOverride = require("method-override"),
	table          = require("./models/table"),
	user           = require("./models/user"),
	ad             = require("./models/ad"),
	bodyParser    = require("body-parser"),
	mongoose       = require("mongoose"),
	express        = require("express"),
	request        = require("request"),
	app            = express();
	
	
	
	

mongoose.Promise = global.Promise;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/atlamaya", {useMongoClient: true});
