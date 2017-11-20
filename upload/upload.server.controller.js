const AWS = require('aws-sdk');
const async = require('async');
const bucketName = "atlamaya";
const path = require('path');
const fs = require('fs');
let pathParams, image, imageName;

/** Load Config File */
AWS.config.loadFromPath('config.json');

/** After config file load, create object for s3*/
const s3 = new AWS.S3({region: 'us-east-2'});
const createMainBucket = (callback) => {
	// Create the parameters for calling createBucket
	const bucketParams = {
	   Bucket : bucketName
	};                    
	s3.headBucket(bucketParams, function(err, data) {
	   if (err) {
	   	console.log("ErrorHeadBucket", err);
	      	s3.createBucket(bucketParams, function(err, data) {
			   if (err) {
			   	console.log("Error", err);
			      callback(err, null);
			   } else {
			      callback(null, data);
			   }
			});
	   } else {
	      callback(null, data);
	   }
	}) ;                            
};

const createItemObject = (callback) => {
  const params = { 
        Bucket: bucketName, 
        Key: `${imageName}`, 
        ACL: 'public-read',
        Body:image
    };
	s3.putObject(params, function (err, data) {
		if (err) {
	    	console.log("Error uploading data: ", err);
	    	callback(err, null);
	    } else {
	    	console.log("Successfully uploaded data on S3", data);
	    	callback(null, data);
	    }
	}) ; 
};
exports.upload = (req, res, next) => {
	var tmp_path = req.files.file.path;
    // console.log("item", req.files.file)
	image = fs.createReadStream(tmp_path);
    imageName = req.files.file.name;
    console.log("Nombre: "+imageName);
    async.series([
        createMainBucket,
        createItemObject
        ], (err, result) => {
        if(err) return res.send(err);
        else {
        	res.locals.url= 'https://s3.us-east-2.amazonaws.com/atlamaya/'+imageName;
        	return next();}
    });
};
