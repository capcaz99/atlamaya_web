var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    userName: String,
    password: String, 
    adress: String,
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

module.exports = mongoose.model("User", userSchema);