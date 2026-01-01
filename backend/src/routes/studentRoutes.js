
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize(['student']));

router.get('/attendance', studentController.getMyAttendance);

module.exports = router;
