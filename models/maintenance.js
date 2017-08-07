var mongoose = require("mongoose");

var maintenanceSchema = mongoose.Schema({
    image: String, 
    name: String,
    image: String,
    job: Boolean //1 Security - 0 Maintenance 
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);