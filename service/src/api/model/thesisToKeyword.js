import db from '../db/dbConnection';
import { DATA_CREATE_SUCCESS } from '../messages/messages';

export default class {
    // this is not completed, and most of the functionality is for update API actually
    static async create(thesisToKeywordObj) {
        console.log(thesisToKeywordObj);
        const { keywords, thesisId } = thesisToKeywordObj;

        const keywordIds = keywords.filter(x => x.id).map(x => x.id);
        const newKeywordsIds = await this.createAndReturnKeywordsIds(keywords);
        const thesisKeywordsIds = [...keywordIds, newKeywordsIds];

        const oldThesisKeywordIds = await this.getKeywordsIdsOfThesis(thesisId);

        const deleteThesisKeywordIds = oldThesisKeywordIds.filter(x => !(x.includes(thesisKeywordsIds)));

        if (deleteThesisKeywordIds && deleteThesisKeywordIds.length > 0) {
            await this.remove(thesisId, deleteThesisKeywordIds)
        }
        
        const values = [];
        newKeywordsIds.forEach(keywordId => {
            values.push([thesisId, keywordId]);
        });
        console.log(values);
        await db.query('INSERT INTO `thesis_to_keyword` (`thesis_id`, `keyword_id`) VALUES ?;', [values]);
        return DATA_CREATE_SUCESS;
    }

    static async createAndReturnKeywordsIds(keywords) {
        const insertKeywordNames = keywords.filter(x => !x.id).map(x => [x.name]);
        const insertResult = await db.query('INSERT IGNORE INTO `keyword` (`name`) VALUES ?;', [insertKeywordNames]);
        
        // Since the last result gives only the insert id of the first row, now we have to get all IDs 
        // that are greater and equal to this insert id   
        const insertedKeywordsIds = await db.query('SELECT id FROM `keyword` WHERE id >= ?;', insertResult.insertId);
        
        return insertedKeywordsIds.map(row => row.id);
    }

    static async getKeywordsIdsOfThesis(thesisId) {
        const result = await db.query('SELECT `keyword_id` FROM `thesis_to_keyword` WHERE thesis_id = ?;', thesisId);
        console.log('4', result);
        return result.map(x => x.keyword_id);
    }

    static async remove(deleteThesisId, deleteKeywordsIds) {
        if (deleteKeywordsIds)
            await db.query(
                'DELETE FROM `thesis_to_keyword` WHERE thesis_id = ? AND keyword_id in (?);', 
                [deleteThesisId, deleteKeywordsIds]
            );            
        else
            await db.query('DELETE FROM `thesis_to_keyword` WHERE thesis_id = ?;', [thesis_id]);
    }
}