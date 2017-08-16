var mongoose = require("mongoose");

var maintenanceSchema = mongoose.Schema({
    
    name: String,
    image: String,
    job: String
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);