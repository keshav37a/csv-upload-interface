const path = require('path');
const fs = require('fs');
const csvJson = require('csvjson');

module.exports.home = async (req, res)=>{
    try{
        let fileInfoArr = await getFilesList();
        return res.render('home.ejs', {files: fileInfoArr});
    }
    catch(err){
        console.log(`err: ${err}`);
        return res.send('<h1>Unexpected Error</h1>');
    }    
}

//Called after clicking on any item in the list of files shown
module.exports.loadFileContent = async (req, res)=>{
    try{
        let reqFileName = req.body.name;
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

//Getting the list of files from the uploads/csv directory
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