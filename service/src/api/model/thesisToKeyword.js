import db from '../db/dbConnection';
import { DATA_CREATE_SUCCESS } from '../messages/messages';

export default class {
    /**
     * Insert rows in thesis_to_keywords table in database.
     * @param {Object} param0                   - { keywords, thesisId }
     * @param {Object[]} param0.keywords        - array that of objects that include the IDs (optional) and name of keywords
     * @param {string} param0.keywords[].id     - the id of keyword if it already exists in db (optional)
     * @param {string} param0.keywords[].name   - name of the keyword
     * @param {number} param0.thesisId          - id of thesis
     */
    static async create({ keywords, thesisId } ) {
        const keywordIds = keywords.filter(x => x.id).map(x => x.id);
        const newKeywordsIds = await this.createKeywordsAndReturnIds(keywords);
        const thesisKeywordsIds = [...keywordIds, ...newKeywordsIds];

        const valuesToBeInserted = thesisKeywordsIds.map(keywordId => [thesisId, keywordId]);

        await db.query('INSERT INTO `thesis_to_keyword` (`thesis_id`, `keyword_id`) VALUES ?;', [valuesToBeInserted]);
        return DATA_CREATE_SUCCESS;
    }

    /**
     * Update thesis_to_keywords table
     * @param {Object} param0                   - { keywords, thesisId }
     * @param {Object[]} param0.keywords        - array that of objects that include the IDs (optional) and name of keywords
     * @param {string} param0.keywords[].id     - the id of keyword if it already exists in db (optional)
     * @param {string} param0.keywords[].name   - name of the keyword
     * @param {number} param0.thesisId          - id of thesis
     */
    static async update({ keywords, thesisId }) {
        const keywordIds = keywords.filter(x => x.id).map(x => x.id);
        const newKeywordsIds = await this.createKeywordsAndReturnIds(keywords);
        const thesisKeywordsIds = [...keywordIds, ...newKeywordsIds];

        if (thesisKeywordsIds.length === 0) {
            return;
        }

        const oldThesisKeywordIds = await this.getKeywordsIdsOfThesis(thesisId);
        const deleteThesisKeywordIds = oldThesisKeywordIds.filter(x => !(thesisKeywordsIds.includes(x)));

        if (deleteThesisKeywordIds && deleteThesisKeywordIds.length > 0) {
            await this.remove(thesisId, deleteThesisKeywordIds);
        }
        
        const valuesToBeUpdated = thesisKeywordsIds.map(keywordId => [thesisId, keywordId]);
        if (valuesToBeUpdated.length === 0) {
            return;
        }
        await db.query('INSERT IGNORE INTO `thesis_to_keyword` (`thesis_id`, `keyword_id`) VALUES ?;', [valuesToBeUpdated]);
        return DATA_CREATE_SUCCESS;
    }

    static async createKeywordsAndReturnIds(keywords) {
        const insertKeywordNames = keywords.filter(x => !x.id).map(x => [x.name]);
        if (insertKeywordNames.length === 0) return;
        const insertResult = await db.query('INSERT IGNORE INTO `keyword` (`name`) VALUES ?;', [insertKeywordNames]);
        if (insertResult.insertId > 0) {
            // Since the last result gives only the insert id of the first row, now we have to get all IDs 
            // that are greater and equal to this insert id   
            const insertedKeywordsIds = await db.query('SELECT id FROM `keyword` WHERE id >= ?;', insertResult.insertId);
            return insertedKeywordsIds.map(row => row.id);    
        }
        return [];
    }

    static async getKeywordsIdsOfThesis(thesisId) {
        const result = await db.query('SELECT `keyword_id` FROM `thesis_to_keyword` WHERE thesis_id = ?;', thesisId);
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