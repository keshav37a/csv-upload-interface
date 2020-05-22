const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/csv_upload_interface');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

db.once('open', function(){
    console.log('successfully connected to database :: MongoDB');
})

module.exports = db;