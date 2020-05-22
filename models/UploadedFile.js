const mongoose = require('mongoose');

const UploadedFileSchema = new mongoose.Schema({
    path:{
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

const UploadedFileModel = mongoose.model('uploadedFile', UploadedFileSchema);
module.exports = UploadedFileModel;