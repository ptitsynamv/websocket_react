const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const authRoutes = require('./routes/auth');
const keys = require('./config/keys');


const app = express();

mongoose.connect(keys.mongoUrl)
    .then(() => console.log('mongo db connected'))
    .catch(error => console.log(error));

app.use(passport.initialize());
require('./soft/passport')(passport);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api/auth', authRoutes);

module.exports = app;