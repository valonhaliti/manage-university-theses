import asyncHandler from '../utils/asyncHandler';
import db from '../db/dbConnection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { regexpEmail } from '../constants';
import { removeFalseyValues } from '../utils/utilFunctionsForAPIs';
import '@babel/polyfill';

export const signUp = asyncHandler(async (req, res, next) => {
    if (!regexpEmail.test(req.body.email)) {
        return res.status(409).json({ 
            message: 'Email address format not valid.'
        });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = removeFalseyValues({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        type: req.body.type,
        registration_year: req.body.registration_year
    });
    try {
        await db.query('INSERT INTO user SET ?;', user);
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
    const user = await db.query('SELECT * FROM user WHERE is_deleted = 0 AND email = ?;', req.body.email);
    if (user.length === 0) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (match) {
        const token = jwt.sign(
            {
                email: user[0].email,
                userId: user[0].id
            }, 
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
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
    const id = req.params.userId;
    const rows = await db.query('SELECT id, firstname, lastname, email, registration_year FROM user where is_deleted = 0 AND id = ?;', id);
    if (rows && rows.length > 0)
        return res.status(200).json({ message: 'Data fetched with success.', data: rows });
    else
        return res.status(404).json({ message: 'User not found' });
});

export const list = asyncHandler(async (req, res, next) => {
    let type = req.query.type; // type = 0 means student, type = 1 means university staff
    if (type) type = parseInt(type);
    let rows;
    if ((type !== undefined) && (type === 0 || type === 1)) 
        rows = await db.query('SELECT id, firstname, lastname, email, registration_year FROM user where is_deleted = 0 AND type = ?;', type);
    else 
        rows = await db.query('SELECT id, firstname, lastname, email, registration_year, type FROM user where is_deleted = 0;');
    const response = {
        message: 'Data fetched with success',
        count: rows.length,
        data: rows
    };
    return res.status(200).json(response);
});

export const update = asyncHandler(async (req, res, next) => {
    const updateUser = removeFalseyValues({
        firstname: req.body.firstname,
        lastname: req.body.lastname    
    });
    await db.query('UPDATE user SET ? WHERE id = ?;', [updateUser, req.params.userId]);
    updateUser.id = req.param.userId;
    return res.status(201).json({ message: 'User updated with success', data: updateUser });
});

export const remove = asyncHandler(async (req, res, next) => {
    await db.query('UPDATE user SET is_deleted = 1 WHERE id = ?;', req.params.userId);
    return res.status(201).json({ message: 'Successfully deleted!' });
});

