const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// @route       GET api/profile/me
// @desc        Get current users profile
// @access      Private
router.get('/me', auth, async (req, res) => {
    console.log(req);
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({message: "There is no profile for this user"});
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route       POST api/profile
// @desc        Create or update user profile
// @access      Private

router.post('/', [auth, [
    body('status').not().isEmpty(),
    body('skills').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    console.log(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) profileFields.skills = skills.split(",").map(skill => skill.trim());

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({user: req.user.id})

        if (profile) {
            // update
            profile = await Profile.findOneAndUpdate({user: req.user.id}, { $set: profileFields }, {new: true});

            return res.json(profile);
        }

        // create a new profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }

});


// @route       GET api/profile/all
// @desc        Get all profiles
// @access      Public
router.get('/all', async (req, res) => {

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    // test
    // This is the way to get all profiles without the user populated
    // Profile.find({}, function(err, profiles) {
    //     var profileMap = {};
    
    //     profiles.forEach(function(profile) {
    //       profileMap[profile._id] = profile;
    //     });
    
    //     res.send(profileMap);  
    //   });

    // This is the way to get the profiles without the ID as an obj
    // Profile.find({}).then(function (profiles) {
    //     res.send(profiles);
    // });
});


// @route       GET api/profile/id
// @desc        Get a profile by ID
// @access      Public
router.get('/:uid', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.uid).populate('user', ['name', 'avatar']);
        res.send(profile);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({msg: 'There is no profile for this user.'})
    }
});

module.exports = router;