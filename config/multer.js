const multer = require('multer');
const path = require('path');
var FILE_PATH = '';

module.exports.setPath = (fileType)=>{
    FILE_PATH = path.join(`/uploads/${fileType}/`);
    return FILE_PATH;
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', FILE_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
  })

//backend validation check for csv file type using fileFilter function
module.exports.uploadedFile = multer({ storage: storage , fileFilter: (req, file, cb)=>{
  let ext = path.extname(file.originalname);
  if (file.mimetype === "application/vnd.ms-excel" && ext==='.csv') {
    cb(null, true);
  } 
  else {
    cb(null, false);
    console.log('Only csv files allowed');
    return cb(new Error('Only csv files allowed'));
  }
}}).single('data-file');
//single for allowance of upload of only single csv file at a time