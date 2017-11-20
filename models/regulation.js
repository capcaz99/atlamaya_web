var mongoose = require("mongoose");

var regulationSchema = mongoose.Schema({
    document: String,
    content: String, 
    title: String
    
});

module.exports = mongoose.model("Regulation", regulationSchema);