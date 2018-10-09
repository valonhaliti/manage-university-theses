import asyncHandler from '../utils/asyncHandler';
import { removeFalseyValues  } from '../utils/utilFunctionsForAPIs';
import '@babel/polyfill';
import thesis from '../model/thesis';

export const create = asyncHandler(async (req, res, next) => {
    const thesisObj = removeFalseyValues({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        filepath: req.file.path,
        added_by: req.userData.userId
    });
    const response = await thesis.create(thesisObj);
    thesis.id = response.id;
    return res.status(201).json({
        message: 'Thesis added in database successfully.',
        data: thesis
    });
});

export const get = asyncHandler(async (req, res, next) => {
    const { thesisId } = req.params;
    const response = await thesis.get(thesisId);
    if (response.length > 0)
        return res.status(200).json({ message: 'Data fetched with success.', data: response });
    else
        return res.status(404).json({ message: 'Thesis not found' });
});

export const list = asyncHandler(async (req, res, next) => {
    let response = await thesis.list();
    response = {
        message: 'Data fetched with success',
        count: response.length,
        data: response
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
    await thesis.update(updateThesis, req.params.thesisId);
    updateThesis.id = req.params.thesisId;
    return res.status(201).json({ message: 'Thesis updated with success', data: updateThesis });
});

export const remove = asyncHandler(async (req, res, next) => {
    await thesis.delete(req.params.thesisId);
    return res.status(201).json({ message: 'Successfully deleted!' });
});
