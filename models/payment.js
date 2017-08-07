var mongoose = require("mongoose");

var paymentSchema = mongoose.Schema({
    created: {type: Date, default:Date.now},
    quantity: Number,
    description: String
});

module.exports = mongoose.model("Payment", paymentSchema);