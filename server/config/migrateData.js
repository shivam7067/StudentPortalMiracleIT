const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

/**
 * Migration helper to ensure existing database documents adhere to
 * the new schema requirements and bcrypt password hashing without
 * losing any existing user data.
 */
async function migrateExistingData() {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    // 1. Backfill student records with missing required fields and bcrypt hash passwords
    const studentsCol = db.collection('students');
    const students = await studentsCol.find().toArray();

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      const updates = {};

      // Ensure rollNo exists
      if (!s.rollNo) {
        updates.rollNo = `MIT-${String(840 + i).padStart(4, '0')}`;
      }

      // Ensure name exists
      if (!s.name) {
        updates.name = s.username || 'Student User';
      }

      // Ensure password is encrypted with bcrypt
      if (s.password && !s.password.startsWith('$2a$') && !s.password.startsWith('$2b$')) {
        updates.password = await bcrypt.hash(s.password, 10);
      }

      // Ensure role is student
      if (!s.role) {
        updates.role = 'student';
      }

      // Ensure status is valid
      if (!s.status || !['Active', 'Inactive'].includes(s.status)) {
        updates.status = 'Active';
      }

      if (Object.keys(updates).length > 0) {
        await studentsCol.updateOne({ _id: s._id }, { $set: updates });
        console.log(`[Migration] Updated student ${s.email}:`, Object.keys(updates));
      }
    }

    // 2. Ensure teachers have bcrypt-hashed passwords
    const teachersCol = db.collection('teachers');
    const teachers = await teachersCol.find().toArray();

    for (const t of teachers) {
      if (t.password && !t.password.startsWith('$2a$') && !t.password.startsWith('$2b$')) {
        const hashedPassword = await bcrypt.hash(t.password, 10);
        await teachersCol.updateOne({ _id: t._id }, { $set: { password: hashedPassword } });
        console.log(`[Migration] Bcrypt-hashed password for teacher: ${t.email}`);
      }
    }

    console.log('[Migration] Database verification and data preservation completed successfully.');
  } catch (error) {
    console.error('[Migration] Data migration error:', error);
  }
}

module.exports = migrateExistingData;
