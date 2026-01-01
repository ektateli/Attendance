
const db = require('../config/db');

exports.getMyAttendance = async (req, res) => {
    try {
        const [records] = await db.query(`
            SELECT a.*, c.name as class_name FROM attendance a
            JOIN classes c ON a.class_id = c.id
            WHERE a.student_id = ?
            ORDER BY a.date DESC`, [req.user.id]);
        
        // Calculate percentages
        const [summary] = await db.query(`
            SELECT status, COUNT(*) as count FROM attendance
            WHERE student_id = ? GROUP BY status`, [req.user.id]);

        res.json({ records, summary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
