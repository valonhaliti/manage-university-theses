import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import userRouter from './api/routes/user';
import thesisRouter from './api/routes/thesis';

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header(
        'Access-Controll-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Controll-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/user', userRouter);
app.use('/thesis', thesisRouter);

app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })  
});

app.listen(port, (err) => {
    if (err) {
        console.log('Error in starting server', err);
    }
    console.log(`listening in ${port}`);
});

// export for testing
module.exports = app;
