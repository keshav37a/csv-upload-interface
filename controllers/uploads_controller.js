module.exports.home = (req, res)=>{
    console.log(`home in uploads_controller called`);
    return res.render('home.ejs');
}