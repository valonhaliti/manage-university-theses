const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');


router.post('/signup', UsersController.signUp);

router.post('/login', UsersController.signIn);

exports = router;

