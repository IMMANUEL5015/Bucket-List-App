//Essential packages
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//User model
const userSchema =  new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please specify a unique username'],
        unique: [true, 'Username already being used by someone else']
    },
    fullName: {
        type: String,
        required: [true, 'This is a required field']
    },
    email: {
        type: String,
        required: [true, 'Please provide us with your email address'],
        unique: [true, 'Email is already being used by someone else'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Your password must consist of at least eight characters']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: 'Password entries are not thesame.'
        },
    },
    bucketlists: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'BucketList'
        }
    ],
    passwordChangedAt: {
       type: Date,
       default: "2019-12-18"
    },
    role : {
        type: String,
        enum: ["admin", "regular", "invalid"],
        default: "regular"
    }
});

//Encrypt password after password has been entered by the user but before saving it to the database
userSchema.pre('save', async function(next){
    if(await this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports =  User;