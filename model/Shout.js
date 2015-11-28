var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var shoutSchema = new Schema({
	imgpath: String,
	author: String,
	message: String,
	date: { type: Date, default: Date.now },
	loc: []
});
shoutSchema.index({loc: '2d'});


shoutSchema.methods.getTimeRemaining = function() {
	var nu = Date.now().toString();
	var toen = new Date(this.date.getTime()).getTime();
	var over = Math.abs(86400000 - (nu - toen));
	
	console.log("remain: " + over);
	return over;
}

/**
 * Gets all shouts that haven't passed the 24h mark yet
 * 24h = 86 400 000 ms
 */
shoutSchema.statics.getShouts = function(cb) {
	var shouts = this.find({date:{ $gte: (Date.now() - 86400000) } }).exec(cb);	
};

/**
 * Gets 10 shouts that haven't passed the 24h mark yet
 * Sorts the shouts by distance (close by -> far away) 
 */
shoutSchema.statics.getDistanceSortedShouts = function(myloc, cb) {
	this.find({ 
		date:{$gte: (Date.now() - 86400000)},
		loc: {'$near': myloc}}
	).limit(10).exec(cb);
};

/**
 * Gets 10 shouts that haven't passed the 24h mark yet within kmradius 
 * from the user. myloc in de vorm [x,y]
 */
shoutSchema.statics.getRadiusShouts = function(myloc, kmradius, cb) {
	var radianRadius = kmradius/6371;	
	this.find( {
		date:{ $gte: (Date.now() - 86400000)},
		loc: { $geoWithin: { $centerSphere: [ myloc, radianRadius ] } }
	}).limit(10).exec(cb);	
};



shoutSchema.statics.addShout = function(req, cb) {
	var Shout = mongoose.model('Shout');	
	var shoutData = {
		imgpath: req.file.path,
		author: req.body.author,
		message: req.body.message,
		loc: [ parseFloat(req.body.longitude), parseFloat(req.body.latitude) ]	
	}	
	new Shout(shoutData).save(cb);
};

	/*this.find({'$where': function() {
		return { 'loc': { 
			'$geoWithin': { "$centerSphere": [ myLoc, radianRadius] } }
		}
	}});*/

shoutSchema.methods.toJSON = function() {
	var remaining = this.getTimeRemaining();  
	
  var obj = this.toObject();
  delete obj.imgpath;  
  //delete obj._id;
  delete obj.__v; 
  
  obj.remaining = remaining;  
  return obj;
}




var Shout = mongoose.model("Shout", shoutSchema);