const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProfileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    status: {
        type: String,
    },
    skills: {
        type: [String],
    },
    bio: {
        type: String,
    },
    githubusername: {
        type: String,
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);