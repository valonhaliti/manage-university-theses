import db from '../db/dbConnection';

export default class {
  static async create(thesisObj) {
    const rows = await db.query('INSERT INTO thesis SET ?;', thesisObj);
    return { id: rows.insertId }
  }

  static async get(thesisId) {
    let query = 'SELECT thesis.*,' 
    query += ' prof.id AS professorId, prof.firstname AS professorFirstName, prof.lastname AS professorLastName,' 
    query += ' student.id AS studentId, student.firstname AS studentFirstName, student.lastname AS studentLastName,'
    query += ' keyword.name AS keyword'
    query += ' FROM thesis '
    query += ' LEFT JOIN thesis_to_user ON thesis.id = thesis_to_user.thesis_id'
    query += ' LEFT JOIN user prof ON thesis_to_user.professor_id = prof.id'
    query += ' LEFT JOIN user student ON thesis_to_user.student_id = student.id'
    query += ' LEFT JOIN thesis_to_keyword ON thesis.id = thesis_to_keyword.thesis_id'
    query += ' LEFT JOIN keyword ON keyword.id = thesis_to_keyword.keyword_id'
    query += ' WHERE thesis.id = ? AND thesis.is_deleted = 0;'
    const rows = await db.query(query, thesisId);
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
