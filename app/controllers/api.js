// routes/api.js

'use strict';

var router = require('express').Router();

var config = require('../../config/config'),
    AuthController = require('./authController');

// ...

var router = require('express').Router();

var config = require('../config');

var APIRoutes = function(passport) {
    // TODO: Create API routes.


    router.post('/signup', AuthController.signUp);

    return router;

    // ...
};

module.exports = APIRoutes;

// ...
