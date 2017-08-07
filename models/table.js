var mongoose = require("mongoose");

var tableSchema = mongoose.Schema({
    job: String, 
    name: String,
    image: String,
    
});

module.exports = mongoose.model("Table", tableSchema);