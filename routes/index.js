const express = require('express');
const router = express.Router();
const uploads_controller = require('../controllers/uploads_controller');

router.get('/', uploads_controller.home);

module.exports = router;