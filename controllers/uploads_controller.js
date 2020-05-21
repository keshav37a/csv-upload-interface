const path = require('path');
const fs = require('fs');
const csvJson = require('csvjson');

module.exports.home = async (req, res)=>{
    try{
        console.log(`home in uploads_controller called`);
        let fileInfoArr = await getFilesList();
        console.log('fileInfoArr: ', fileInfoArr);
        return res.render('home.ejs', {files: fileInfoArr});
    }
    catch(err){
        console.log(`err: ${err}`);
    }    
}

module.exports.loadFileContent = async (req, res)=>{
    try{
        console.log('req.body');
        console.log(req.body);
        let reqFileName = req.body.name;
        let fileInfoArr = await getFilesList();
        let filePath = path.join(__dirname, '../uploads/csv');    
        let fileData = await fs.readFileSync(filePath+'\\'+reqFileName, 'utf8');
        let jsonData = csvJson.toObject(fileData);
        return res.status(200).json({
            data: jsonData
        });
    }
    catch(err){
        console.log(`err: ${err}`);
        return res.status(200).json({
            data: 'no data'
        });
    }
    
    
}

const getFilesList = async ()=>{
    let filePath = path.join(__dirname, '../uploads/csv');    
    const files = await fs.readdirSync(filePath);
    let fileInfoArr = [];
    for(let file of files){
        let fileStats = await fs.statSync(filePath+'/'+file);
        fileStats['name'] = file;
        fileInfoArr.push(fileStats);
    }
    return fileInfoArr;
}