
var multer  = require('multer');

var fileFilter = function fileFilter (req, file, cb) {
	if(file.mimetype !== 'image/png') {
		return cb(new Error('PNG files only!'));
	} 
	return cb(null, true); 
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/public')
  },
  filename: function (req, file, cb) {	
		cb(null, Date.now() + '_' + file.fieldname + '.png');		
  }
});
var upload = multer({ storage: storage, fileFilter : fileFilter});

module.exports = upload;