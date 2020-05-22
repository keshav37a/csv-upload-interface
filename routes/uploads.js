const express = require('express');
const router = express.Router();
const uploads_controller = require('../controllers/uploads_controller');

router.post('/csv', uploads_controller.csvUpload);

module.exports = router;