import asyncHandler from '../utils/asyncHandler';
import '@babel/polyfill';
import searchSql from '../model/search';

export const search = asyncHandler(async (req, res, next) => {
  let searchQuery = req.query.searchQuery;
  let response = await searchSql.search(searchQuery);
  response = {
    message: 'Data fetched with success',
    data: response
  }
  return res.status(200).json(response);
});

