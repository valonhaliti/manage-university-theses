import db from '../db/dbConnection';

export default class {
  static async create(userObj) {
    const rows = await db.query('INSERT INTO user SET ?;', userObj);
    return { id: rows.insertId }
  }

  static async get(userId) {
    const rows = await db.query(
      'SELECT id, firstname, lastname, email, registration_year, type, department, program FROM user where is_deleted = 0 AND id = ?;', 
      userId);
    return rows;
  }

  static async getFromEmail(userEmail) {
    const rows = await db.query('SELECT * FROM user WHERE is_deleted = 0 AND email = ?;', userEmail);
    return rows;
  }

  static async listAll() {
    const rows = await db.query('SELECT id, firstname, lastname, email, registration_year, type FROM user where is_deleted = 0;');
    return rows;
  }

  static async listByType(type) {
    const rows = await db.query('SELECT id, firstname, lastname, email, registration_year FROM user where is_deleted = 0 AND type = ?;', type)
    return rows;
  }

  static async update(updateUserObj, userId) {
    const response =  await db.query('UPDATE user SET ? WHERE id = ?;', [updateUserObj, userId]);;
    return response;
  }

  static async delete(userId) {
    const response = await db.query('UPDATE user SET is_deleted = 1 WHERE id = ?;', userId);
    return response;
  }
}
