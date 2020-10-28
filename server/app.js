const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const auth = require('./routes/auth');
const profile = require('./routes/profile');
const user = require('./routes/user');
const record = require('./routes/record');

// MongoDB config
require('./loaders/db');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(logger('dev'));

app.use(async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      const userJson = jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.SECRET_KEY
      );
      req.user = {
        _id: userJson._id,
        role: userJson.role,
        email: userJson.email,
      };
    }
  } catch (err) {}
  next();
});

app.use('/auth', auth);
app.use('/profile', profile);
app.use('/user', user);
app.use('/record', record);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
