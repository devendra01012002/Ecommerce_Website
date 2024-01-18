const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    email: {
        type: 'string',
        trim:true,
        required: true
    },
    role: {
        type: 'string',
        required: true
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product',
        }
    ]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);