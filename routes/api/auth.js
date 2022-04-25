const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { body, validationResult, check } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

// @route       GET api/auth
// @desc        Test route
// @access      Public
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ "msg": "Token is not valid" });
    }
})

// @route       POST api/auth
// @desc        Authenticate User & get token
// @access      Public
router.post('/',
    // username must be an email
    body('email').isEmail(),
    check('password').exists().withMessage('Password required'),
    // password must be at least 5 chars long
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const password = req.body.password;
        const email = req.body.email;

        try {
            // Check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
            }


            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

        } catch (err) {
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;