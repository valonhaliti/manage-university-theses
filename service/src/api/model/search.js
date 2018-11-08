import db, { escape } from '../db/dbConnection';

// This is only for testing FRONT END, we should change the search 
// to ElasticSearch

export default class {
  static async search(searchQuery) {
    let query = "SELECT thesis.*,"
    + " prof.id AS professorId, prof.firstname AS professorFirstName, prof.lastname AS professorLastName,"
    + " student.id AS studentId, student.firstname AS studentFirstName, student.lastname AS studentLastName,"
    + " keyword.name AS keyword"
    + " FROM thesis"
    + " LEFT JOIN thesis_to_user on thesis.id = thesis_to_user.thesis_id"
    + " LEFT JOIN user student on thesis_to_user.student_id = student.id"
    + " LEFT JOIN user prof on thesis_to_user.professor_id = prof.id"
    + " LEFT JOIN thesis_to_keyword on thesis_to_keyword.thesis_id = thesis.id"
    + " LEFT JOIN keyword on thesis_to_keyword.keyword_id = keyword.id"
    + " WHERE (thesis.title LIKE ? OR thesis.description LIKE ?"  
    + " OR thesis.category LIKE ? OR prof.firstname LIKE ?" 
    + " OR prof.lastname LIKE ? OR  student.firstname LIKE ?" 
    + " OR student.lastname LIKE ? OR  keyword.name LIKE ?) AND thesis.is_deleted = 0;"

    let queryParams = [];
    for (let i = 0; i < 8; i++) queryParams[i] = `%${searchQuery}%`;
    const rows = await db.query(query, queryParams);
    return rows;
  }
}
