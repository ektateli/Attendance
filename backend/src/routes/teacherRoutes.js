
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize(['teacher']));

router.get('/classes', teacherController.getMyClasses);
router.get('/classes/:classId/students', teacherController.getClassStudents);
router.post('/attendance', teacherController.markAttendance);

module.exports = router;
