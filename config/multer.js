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

module.exports.uploadedFile = multer({ storage: storage }).single('data-file');