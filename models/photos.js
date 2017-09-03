var mongoose = require("mongoose");

var photoSchema = mongoose.Schema({
    created: {type: Date, default:Date.now},
    image: String,
});

module.exports = mongoose.model("Photo", photoSchema);