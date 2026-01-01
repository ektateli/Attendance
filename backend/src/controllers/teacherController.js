
const db = require('../config/db');

exports.getMyClasses = async (req, res) => {
    try {
        const [classes] = await db.query(`
            SELECT c.*, (SELECT COUNT(*) FROM class_students WHERE class_id = c.id) as student_count 
            FROM classes c WHERE c.teacher_id = ?`, [req.user.id]);
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getClassStudents = async (req, res) => {
    try {
        const [students] = await db.query(`
            SELECT u.id, u.name, u.email FROM users u
            JOIN class_students cs ON u.id = cs.student_id
            WHERE cs.class_id = ?`, [req.params.classId]);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { classId, attendanceData, date } = req.body; // attendanceData: [{studentId, status}]
        
        for (let item of attendanceData) {
            await db.query(`
                INSERT INTO attendance (class_id, student_id, date, status) 
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE status = ?`, 
                [classId, item.studentId, date, item.status, item.status]);
        }
        res.json({ message: 'Attendance updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
