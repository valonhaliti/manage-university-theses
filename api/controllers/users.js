const asyncHandler = require('../utils/asyncHandler');
const db = require('../../dbconnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const regexpEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;


exports.users_signup = asyncHandler(async (req, res, next) => {
    if (!regexpEmail.test(req.body.email)) {
        return res.status(409).json({ 
            message: 'Email address format not valid.'
        });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = {
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        type: req.body.type,
        registration_year: req.body.registration_year
    };
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

exports.users_signin = asyncHandler(async (req, res, next) => {
    const user = await db.query('SELECT * FROM user WHERE email = ?;', req.body.email);
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
