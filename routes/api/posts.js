const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { json } = require('express/lib/response');
const { body, validationResult } = require('express-validator');

// @route       GET api/posts
// @desc        Test route
// @access      Public
router.get('/', (req, res) => {
    res.send('Posts route...!');
})

module.exports = router;