import db from '../db/dbConnection';

export default class {
  static async list() { 
    const rows = await db.query('SELECT * FROM keyword;');
    return rows;
  }
}
