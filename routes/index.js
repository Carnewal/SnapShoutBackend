var express = require('express');
var router = express.Router();
var upload = require('../config/multer');

var mongoose = require('mongoose');
var Shout = mongoose.model('Shout');
var path = require('path');



router.post('/shout', function (req, res) {
	upload.single('shout')(req,res,function(err) {
		if(err) {
			return res.status(415).json({'error': err.message});
		}
		if(!req.file) {
			return res.status(400).json({'error': 'No file'});
		}
		
		Shout.addShout(req, function(err, shout) {
			if(err) {
				return res.status(400).json({'error': err.message});	
			}
			return res.status(200).json(shout.toJSON());	
		});
	});
});

router.get('/shout/:id/img', function(req, res) {	
	Shout.findOne({_id: req.params.id}).exec(function(err, shout) {
		if(err) {
			return res.status(400).json({'error': err.message});
		}
		if(!shout) {	
			return res.status(400).json({'error': 'Couldn\'t find shout'});
		}
		if(shout.getTimeRemaining() <= 0) {
			return res.status(400).json({'error': 'Shout is older than 24h'});
		}
		
		var p = path.join(__dirname, ('../' + shout.imgpath));
		console.log(p);
		return res.status(200).sendFile(p);
	});
});


router.get('/shouts', function (req, res) {	
	Shout.getShouts(function(err, shouts) {		
		if(err) {
			return res.status(400).json({'error':err});
		}
		return res.status(200).json(shouts);	
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
