const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { json } = require('express/lib/response');
const { body, validationResult } = require('express-validator');

// @route       GET api/posts
// @desc        Test route
// @access      Public
router.get('/', [ auth, [
    body('text').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({msg: errors.array()})
    }
})

module.exports = router;