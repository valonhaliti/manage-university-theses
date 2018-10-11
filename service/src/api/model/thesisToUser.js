import db from '../db/dbConnection';
import { DATA_CREATE_SUCCESS } from '../messages/messages';

export default class {
    static async create(thesisToUserObj) {
        await db.query('INSERT INTO thesis_to_user SET ?;', thesisToUserObj);
        return DATA_CREATE_SUCCESS;
    }
}