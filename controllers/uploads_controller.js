module.exports.home = (req, res)=>{
    console.log(`home in uploads_controller called`);
    return res.send(`<h1>home in uploads_controller called</h1>`);
}