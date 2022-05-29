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
        const posts = Post.find({}).sort('-date').exec((err, posts) => {
            res.send(posts);
        });
    } catch(err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

// @route       GET api/posts:id
// @desc        Get post by id
// @access      Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({msg: "Post not found"});
        }
        res.json(post);
    } catch(err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: "Post not found"});
        }
        res.status(500).send("Server error");
    }
})


// @route       DELETE api/post/id
// @desc        DELETE post by id
// @access      Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Check on the user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "Not authorised to delete this post."})
        }
        await post.remove();
        return res.json({msg: "Post removed."})
    } catch(err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: "Post not found"});
        }
        res.status(500).send("Server error");
    }
})

router.put('/like/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
            await post.likes.splice(removeIndex, 1);
            await post.save();
            return res.status(400).json({msg: "Post already liked and now it's unliked."})
            // already been liked
        } else {
            post.likes.unshift({ user: req.user.id })
            // not been liked                   
        }
        await post.save();
        res.json(post.likes);
    } catch(err) {
        res.status(500).send("Server error");
    }
})



module.exports = router;