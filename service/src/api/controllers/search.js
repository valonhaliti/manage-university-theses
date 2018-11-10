import asyncHandler from '../utils/asyncHandler';
import { DATA_FETCHED_SUCCESS } from '../constants';
import '@babel/polyfill';
import searchSql from '../model/search';

export const search = asyncHandler(async (req, res, next) => {
  let searchQuery = req.query.searchQuery;
  let response = await searchSql.search(searchQuery);
  response = {
    message: DATA_FETCHED_SUCCESS,
    data: response
  }
  return res.status(200).json(response);
});

