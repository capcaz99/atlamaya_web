var mongoose = require("mongoose");

var maintenanceSchema = mongoose.Schema({
    
    name: String,
    image: String,
    job: Boolean //True Security - False Maintenance 
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);