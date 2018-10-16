import db from '../db/dbConnection';

export default class {
  static async createOrUpdate(similiarityReportObj) {
    const rows = await db.query('SELECT * FROM `similarity_report` WHERE thesis_id = ?;', similiarityReportObj.thesis_id);
    
    if (rows && rows.length > 0) {
      const res = db.query('UPDATE `similarity_report` SET ? WHERE id = ?;', [similiarityReportObj, rows[0].id]);
      return res;
    } else {
      const res = db.query('INSERT INTO `similarity_report` SET ?;', similiarityReportObj);
      return res;
    }
  }
}
