var mongoose = require("mongoose");

var adSchema = mongoose.Schema({
    created: {type: Date, default:Date.now},
    content: String, 
    title: String,
    image: String,
    creator: String
    
});

module.exports = mongoose.model("Ad", adSchema);