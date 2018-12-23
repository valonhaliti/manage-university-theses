import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import morgan from 'morgan';
import logger, { LoggerStream } from './api/utils/logger';
import bodyParser from 'body-parser';
import path from "path";

import userRouter from './api/routes/user';
import thesisRouter from './api/routes/thesis';
import compareThesesRouter from './api/routes/compareTheses';
import keywordRouter from './api/routes/keyword';
import searchRouter from './api/routes/search';

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('combined', { stream: new LoggerStream() }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Controll-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/api/user', userRouter);
app.use('/api/thesis', thesisRouter);
app.use('/api/compareTheses', compareThesesRouter);
app.use('/api/keyword', keywordRouter);
app.use('/api/search', searchRouter);


app.use('/static',
  express.static(path.resolve('../web/build/static'))
);
app.use('*',
  express.static(path.resolve('../web/build'))
);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  logger.error(error);
  res.json({
    error: {
      message: error.message
    }
  })
});


app.listen(port, (err) => {
  if (err) {
    logger.error('Error in starting server', err);
  }
  logger.info(`listening in ${port}`);
});

// export for testing
module.exports = app;
