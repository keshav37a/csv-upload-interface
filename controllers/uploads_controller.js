const MulterConfig = require('../config/multer');
const UploadedFile = require('../models/UploadedFile');

module.exports.csvUpload = async (req, res)=>{
    try{
        console.log('csvUpload called');
        // uploadedFile
        let type = 'csv';
        let filePath = MulterConfig.setPath(type);
    
        MulterConfig.uploadedFile(req, res, async function(err){
            if(err) {console.log(`err: ${err}`); }
    
            filePath += `${req.file.filename}`;
            console.log(filePath);
            let uploadedFile = await UploadedFile.create({path: filePath, type: type});
            console.log(uploadedFile);
        });
        return res.redirect('/');
    }
    catch(err){
        console.log(`err: ${err}`);
        return res.redirect('/');
    }   
}