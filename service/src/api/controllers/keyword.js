import asyncHandler from '../utils/asyncHandler';
import { removeFalseyValues  } from '../utils/utilFunctionsForAPIs';
import '@babel/polyfill';
import keyword from '../model/keyword';

export const list = asyncHandler(async (req, res, next) => {
  let response = await keyword.list();
  response = {
    message: 'Data fetched with success',
    data: response
  }
  return res.status(200).json(response);
});

