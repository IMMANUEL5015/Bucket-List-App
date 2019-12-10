const mongoose = require('mongoose');

const bucketListSchema =  new mongoose.Schema({
    name:{
        type: String, 
        required: [true, "This is a required field"]
    },
    description: {
        type: String,
        required: [true, 'A bucketlist must have a description']
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    date_modified: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: String,
        required: [true, 'Please enter your unique username']
    }
});

const BucketList = mongoose.model('BucketList', bucketListSchema);

module.exports = BucketList;