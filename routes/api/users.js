const express = require('express');

const router = express.Router();

const { body, validationResult } = require('express-validator');

// @route       POST api/users
// @desc        Register User
// @access      Public
router.post('/',
    // username must be an email
    body('name').not().isEmpty().trim().escape(),
    // password must be at least 5 chars long
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.send('User route');
        console.log(req.body);
        console.log(req.body.name);
    });



module.exports = router;