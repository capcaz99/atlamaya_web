var mongoose = require("mongoose");

var financialSchema = mongoose.Schema({
    document: String,
    title: String,
    created: {type: Date, default:Date.now},
    description: String,
    image: String
});

module.exports = mongoose.model("Financial", financialSchema);