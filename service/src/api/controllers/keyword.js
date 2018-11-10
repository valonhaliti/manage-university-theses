import asyncHandler from '../utils/asyncHandler';
import { DATA_FETCHED_SUCCESS } from '../constants';
import '@babel/polyfill';
import keyword from '../model/keyword';

export const list = asyncHandler(async (req, res, next) => {
  let response = await keyword.list();
  response = {
    message: DATA_FETCHED_SUCCESS,
    data: response
  }
  return res.status(200).json(response);
});

