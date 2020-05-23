const MulterConfig = require('../config/multer');
const UploadedFile = require('../models/UploadedFile');

module.exports.csvUpload = async (req, res)=>{
    try{
        //this is called to dynamically set the type and the path based on the uploaded type of file. So same multer config could be used for different file types
        let type = 'csv';
        let filePath = MulterConfig.setPath(type);
    
        MulterConfig.uploadedFile(req, res, async function(err){
            if(err) {console.log(`err: ${err}`); }
            
            filePath += `${req.file.filename}`;
            let uploadedFile = await UploadedFile.create({path: filePath, type: type});
        });
        return res.redirect('/');
    }
    catch(err){
        console.log(`err: ${err}`);
        return res.redirect('/');
    }   
}