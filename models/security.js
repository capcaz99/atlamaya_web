var mongoose = require("mongoose");

var securitySchema = mongoose.Schema({
    
    name: String,
    image: String,
    job: String 
});

module.exports = mongoose.model("Security", securitySchema);