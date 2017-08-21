var mongoose = require("mongoose");

var newsSchema = mongoose.Schema({
    created: {type: Date, default:Date.now},
    content: String, 
    title: String,
    image: String,
    
});

module.exports = mongoose.model("News", newsSchema);