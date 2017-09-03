var mongoose = require("mongoose");

var gallerySchema = mongoose.Schema({
    created: {type: Date, default:Date.now},
    title: String,
    cover: String,
    historic: Boolean,    //True-Archivo histórico.  False-Galeria normal. 
    photos:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Photo"
        }
    ]
});

module.exports = mongoose.model("Gallery", gallerySchema);