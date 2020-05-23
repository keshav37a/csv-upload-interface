const express = require('express');
const router = express.Router();
const uploads_controller = require('../controllers/uploads_controller');

//Route for csv type upload. For other file types more can be added here
router.post('/csv', uploads_controller.csvUpload);

module.exports = router;