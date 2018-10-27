import db from '../db/dbConnection';

export default class {
  static async create(thesisObj) {
    const rows = await db.query('INSERT INTO thesis SET ?;', thesisObj);
    return { id: rows.insertId }
  }

  static async get(thesisId) {
    const rows = await db.query('SELECT * FROM thesis WHERE is_deleted = 0 AND id = ?;', thesisId);
    return rows;
  }

  static async list() {
    let query = 'SELECT id, title, description, category, filepath, status, created_date as createdDate, professor_id, student_id ';
    query += 'FROM thesis LEFT JOIN thesis_to_user ON thesis.id = thesis_to_user.thesis_id ';
    query += 'WHERE thesis.is_deleted = 0 ORDER BY createdDate DESC;'
    
    const rows = await db.query(query);
    return rows;
  }

  static async update(updateThesisObj, thesisId) {
    const response = await db.query('UPDATE thesis SET ? WHERE id = ?;', [updateThesisObj, thesisId]);
    return response;
  }

  static async delete(thesisId) {
    const response = await db.query('UPDATE thesis SET is_deleted = 1 WHERE id = ?;', thesisId);
    return response;
  }
}
