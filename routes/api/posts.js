const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { json } = require('express/lib/response');
const { body, validationResult } = require('express-validator');


const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


// @route       POST api/posts
// @desc        Create a post
// @access      Private
router.post('/', [ auth, [
    body('text').not().isEmpty(),
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({msg: errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = newPost;
        await post.save();
        res.json(post);

    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

// @route       GET api/posts
// @desc        Get all posts
// @access      Public
router.get('/', async (req, res) => {
    try {
        Post.find({}, (err, posts) => {
            res.send(posts);
        });
    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

module.exports = router;