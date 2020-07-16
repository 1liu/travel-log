const express = require('express');
// morgan: log request to console
const morgan = require('morgan');
// helmet: secure request header
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const middlewares = require('./middlewares');

const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello, this is root route',
  });
});

// middlewares
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
