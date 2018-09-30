import asyncHandler from '../utils/asyncHandler';
import db from '../db/dbConnection';
import { removeFalseyValues  } from '../utils/updateFunction';
import "@babel/polyfill";

export const create = asyncHandler(async (req, res, next) => {
    const thesis = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        filepath: req.file.path
    };
    const rows = await db.query('INSERT INTO thesis SET ?;', thesis);
    thesis.id = rows.insertId;
    return res.status(201).json({
        message: 'Thesis added in database successfully.',
        data: thesis
    });
});

export const get = asyncHandler(async (req, res, next) => {
    const id = req.params.thesisId;
    const rows = await db.query('SELECT * FROM thesis WHERE is_deleted = 0 AND id = ?;', id);
    if (rows && rows.length > 0)
        return res.status(200).json({ message: 'Data fetched with success.', data: rows });
    else
        return res.status(404).json({ message: 'Thesis not found' });
});

export const list = asyncHandler(async (req, res, next) => {
    const rows = await db.query('SELECT id, title, description, category, filepath FROM thesis WHERE is_deleted = 0;');
    const response = {
        message: 'Data fetched with success',
        count: rows.length,
        data: rows
    };
    return res.status(200).json(response);
});

export const update = asyncHandler(async (req, res, next) => {
    const updateThesis = removeFalseyValues({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        filepath: req.file && req.file.path
    });
    await db.query('UPDATE thesis SET ? WHERE id = ?;', [updateThesis, req.params.thesisId]);
    updateThesis.id = req.param.thesisId;
    return res.status(201).json({ message: 'Thesis updated with success', data: updateThesis });
});

export const remove = asyncHandler(async (req, res, next) => {
    await db.query('UPDATE thesis SET is_deleted = 1 WHERE id = ?;', req.params.thesisId);
    return res.status(201).json({ message: 'Successfully deleted!' });
});
