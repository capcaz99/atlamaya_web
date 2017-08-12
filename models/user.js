var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password: String, 
    address: String,
    phone: Number,
    reference: String, 
    blocked: Boolean, //0 No - 1 Yes
    admin: Boolean, //0 No - 1 Yes
    ads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ad"
        }
    ],
    payments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment"
        }
    ]
    
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);