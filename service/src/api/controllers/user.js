import asyncHandler from '../utils/asyncHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { REGEXP_EMAIL, DATA_FETCHED_SUCCESS } from '../constants';
import { removeFalseyValues } from '../utils/utilFunctionsForAPIs';
import '@babel/polyfill';
import user from '../model/user';
import { verifyToken } from './auth';

export const signUp = asyncHandler(async (req, res, next) => {
  if (!REGEXP_EMAIL.test(req.body.email)) {
    return res.status(409).json({
      message: 'Email address format not valid.'
    });
  }
  const hash = await bcrypt.hash(req.body.password, 10);
  const userObj = removeFalseyValues({
    email: req.body.email,
    password: hash,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    type: req.body.type,
    department: req.body.department,
    program: req.body.program,
    registration_year: req.body.registration_year
  });
  if (userObj && isNaN(parseInt(userObj.registration_year))) {
    delete userObj.registration_year;
  }
  try {
    await user.create(userObj);
    return res.status(201).json({
      message: 'User created'
    });
  }
  catch(err) {
    switch(err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(409).json({
          message: 'Mail exists.'
        });
      case 'ER_DATA_TOO_LONG':
        return res.status(409).json({
          message: 'Email too long.'
        });
      default:
        throw err;
    }
  }
});

export const signIn = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization) {
    const response = verifyToken(req.headers.authorization);
    return res.status(200).json({
      decoded: response
    })
  }

  const userResponse = await user.getFromEmail(req.body.email);
  if (userResponse.length === 0) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }

  const match = await bcrypt.compare(req.body.password, userResponse[0].password);
  if (match) {
    const token = jwt.sign(
      {
        email: userResponse[0].email,
        userId: userResponse[0].id,
        userType: userResponse[0].type
      },
      process.env.JWT_KEY,
      {
        expiresIn: "24h"
      }
    );
    return res.status(200).json({
      message: 'You logged in',
      token
    })
  };
  return res.status(401).json({
    message: 'Auth failed'
  });
});

export const get = asyncHandler(async (req, res, next) => {
  const response = await user.get(req.params.userId);
  if (response && response.length > 0)
    return res.status(200).json({ message: DATA_FETCHED_SUCCESS, data: response });
  else
    return res.status(404).json({ message: 'User not found' });
});

export const list = asyncHandler(async (req, res, next) => {
  let type = req.query.type; // type = 0 means student, type = 1 means university staff
  if (type !== undefined)  {
    type = parseInt(type);
  }
  let rows;
  if ((type !== undefined) && (type === 0 || type === 1))
    rows = await user.listByType(type);
  else
    rows = await user.listAll();
  const response = {
    message: DATA_FETCHED_SUCCESS,
    count: rows.length,
    data: rows
  };
  return res.status(200).json(response);
});

export const update = asyncHandler(async (req, res, next) => {
  if (req.userData !== 'admin' && req.userData.userId !== Number(req.params.userId)) {
    return res.status(401).json({ message: 'Not authorized to update' })
  }

  const updateUser = removeFalseyValues({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    registration_year: req.body.registration_year,
    proposed_theses_list: req.body.proposedThesesList
  });
  await user.update(updateUser, req.params.userId);
  updateUser.id = req.params.userId;
  return res.status(201).json({ message: 'User updated with success', data: updateUser });
});

export const updateProposedThesesList = asyncHandler(async (req, res, next) => {
  const updateUser = removeFalseyValues({
    proposed_theses_list: req.body.proposedThesesList
  });
  await user.update(updateUser, req.params.userId);
  updateUser.id = req.params.userId;
  return res.status(201).json({ message: 'User updated with success', data: updateUser });
});



export const remove = asyncHandler(async (req, res, next) => {
  await user.delete(req.params.userId);
  return res.status(201).json({ message: 'Successfully deleted!' });
});
