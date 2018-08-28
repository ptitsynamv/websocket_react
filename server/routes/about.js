const express = require('express');
const router = express.Router();
const controller = require('../controllers/about');
const passport = require('passport');

router.get('/service', passport.authenticate('jwt', {session: false}), controller.service);
module.exports = router;